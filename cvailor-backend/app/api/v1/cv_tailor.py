"""
CV Tailor route — POST /api/v1/cv/tailor

Protected endpoint that uses GPT-4 to tailor a CV to a specific job description.

Responsibilities of this module (route only — no business logic):
  - Accept the request and authenticate via CurrentUser dependency
  - Delegate validation to CvTailorValidator (raises ValidationException)
  - Delegate tailoring to CvTailorService (raises Rate/ServiceUnavailable)
  - Map every domain exception to a structured JSON error response
  - Never expose internal details or stack traces to the client

All errors follow the shape: {"error": {"code": "...", "message": "...", "details": {...}}}
"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.core.dependencies import CurrentUser, DbSession
from app.core.exceptions import (
    RateLimitException,
    ServiceUnavailableException,
    UnauthorisedException,
    ValidationException,
)
from app.core.logging import get_logger
from app.schemas.cv_tailor import TailorRequest, TailorResponse
from app.services.cv_tailor_service import CvTailorService
from app.validators.cv_tailor_validator import CvTailorValidator

logger = get_logger(__name__)
router = APIRouter()

_validator = CvTailorValidator()


def _error_response(code: str, message: str, details: dict, status: int) -> JSONResponse:
    """Build the standard error envelope used by all failure paths."""
    return JSONResponse(
        status_code=status,
        content={"error": {"code": code, "message": message, "details": details}},
    )


@router.post(
    "/tailor",
    response_model=TailorResponse,
    status_code=201,
    responses={
        422: {"description": "Validation error — field-level details in error.details"},
        429: {"description": "Daily tailoring limit reached"},
        503: {"description": "AI service temporarily unavailable"},
    },
    summary="Tailor a CV to a job description using GPT-4",
)
async def tailor_cv(
    payload: TailorRequest,
    db: DbSession,
    current_user: CurrentUser,
) -> TailorResponse | JSONResponse:
    """
    Tailor a CV to a job description using GPT-4.

    - Validates job description word count (50–5 000 words)
    - Validates CV data completeness, email format, and minimum skills
    - Rate limited to CV_TAILOR_DAILY_LIMIT requests per user per day
    - Saves both original and tailored content to cv_tailor_history (never overwrites)
    - Returns tailored CV with ATS score, keyword analysis, and improvement suggestions

    user_id is extracted from the JWT token — it is never read from the request body.
    """
    try:
        _validator.validate(payload)
        return await CvTailorService(db).tailor(payload, current_user)

    except ValidationException as exc:
        logger.warning(
            "cv_tailor_validation_error",
            user_id=str(current_user.id),
            details=exc.details,
        )
        return _error_response(exc.code, exc.message, exc.details, 422)

    except RateLimitException as exc:
        logger.warning("cv_tailor_rate_limit", user_id=str(current_user.id))
        return _error_response(exc.code, exc.message, exc.details, 429)

    except ServiceUnavailableException as exc:
        logger.error("cv_tailor_service_unavailable", message=exc.message)
        return _error_response(exc.code, exc.message, exc.details, 503)

    except UnauthorisedException as exc:
        return _error_response(exc.code, exc.message, exc.details, 401)

    except Exception as exc:
        logger.error("cv_tailor_unexpected_error", error=str(exc), exc_info=True)
        return _error_response(
            "INTERNAL_ERROR",
            "An unexpected error occurred. Please try again.",
            {},
            500,
        )
