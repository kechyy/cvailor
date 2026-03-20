"""
Validator for the CV Tailor endpoint.

Business rules are enforced here — not in the route handler or service —
so they remain independently testable and the service stays focused on
orchestration.

All validation failures are collected before raising a single
ValidationException containing field-level error messages.
"""
import re

from app.core.exceptions import ValidationException
from app.schemas.cv_tailor import TailorRequest

# Simple RFC-5322-ish email pattern (pydantic[email] EmailStr is available but
# we validate manually here to produce a tailored user-facing message).
_EMAIL_RE = re.compile(
    r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
)

_JD_MIN_WORDS = 50
_JD_MAX_WORDS = 5_000
_SKILLS_MIN = 3


class CvTailorValidator:
    """Validates a TailorRequest before it reaches the AI service."""

    def validate(self, payload: TailorRequest) -> None:
        """
        Run all validation rules. Collects every field error before raising
        so the client receives a complete picture in a single response.

        Raises:
            ValidationException: if any rule fails, with field-level details.
        """
        errors: dict[str, str] = {}
        self._validate_job_description(payload.job_description, errors)
        self._validate_cv_data(payload, errors)

        if errors:
            raise ValidationException(
                message="Request validation failed. Please fix the highlighted fields.",
                details=errors,
                code="VALIDATION_ERROR",
            )

    # ── Private helpers ───────────────────────────────────────────────────────

    def _validate_job_description(self, jd: str, errors: dict[str, str]) -> None:
        """Job description must be between 50 and 5 000 words."""
        word_count = len(jd.split())
        if word_count < _JD_MIN_WORDS:
            errors["job_description"] = (
                f"Job description is too short ({word_count} words). "
                f"A minimum of {_JD_MIN_WORDS} words is required for accurate tailoring."
            )
        elif word_count > _JD_MAX_WORDS:
            errors["job_description"] = (
                f"Job description is too long ({word_count:,} words). "
                f"Maximum {_JD_MAX_WORDS:,} words allowed."
            )

    def _validate_cv_data(self, payload: TailorRequest, errors: dict[str, str]) -> None:
        """Validate CV content fields required for quality tailoring results."""
        cv = payload.cv_data

        # Skills: minimum 3 items so the AI has enough signal
        if len(cv.skills) < _SKILLS_MIN:
            errors["cv_data.skills"] = (
                f"At least {_SKILLS_MIN} skills are required "
                f"(you have {len(cv.skills)}). "
                "Add more skills to improve your tailoring results."
            )

        # Phone: must be present
        if not cv.personal.phone.strip():
            errors["cv_data.personal.phone"] = (
                "Phone number is required. Add it in the editor before tailoring."
            )

        # Email: must be valid format if provided
        if cv.personal.email and not _EMAIL_RE.match(cv.personal.email.strip()):
            errors["cv_data.personal.email"] = (
                f"'{cv.personal.email}' is not a valid email address. "
                "Please correct it in the editor."
            )
