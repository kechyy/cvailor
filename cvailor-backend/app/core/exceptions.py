"""
Custom domain exceptions for the Cvailor API.

Each exception maps to a specific HTTP status code and produces a structured
error body: {"error": {"code": "...", "message": "...", "details": {...}}}.

These are raised in service/validator layers and caught in route handlers,
which keeps business logic free of HTTP concerns.
"""
from typing import Any


class ValidationException(Exception):
    """Raised when request data fails business-rule validation. → HTTP 422."""

    def __init__(
        self,
        message: str,
        details: dict[str, Any] | None = None,
        code: str = "VALIDATION_ERROR",
    ) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}
        self.code = code


class RateLimitException(Exception):
    """Raised when a user exceeds the allowed request rate. → HTTP 429."""

    def __init__(
        self,
        message: str = "Too many requests. Please try again later.",
        details: dict[str, Any] | None = None,
        code: str = "RATE_LIMIT_EXCEEDED",
    ) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}
        self.code = code


class ServiceUnavailableException(Exception):
    """Raised when a downstream service is temporarily unavailable. → HTTP 503."""

    def __init__(
        self,
        message: str = "Service temporarily unavailable. Please try again in a moment.",
        details: dict[str, Any] | None = None,
        code: str = "SERVICE_UNAVAILABLE",
    ) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}
        self.code = code


class UnauthorisedException(Exception):
    """Raised when authentication or authorisation fails. → HTTP 401."""

    def __init__(
        self,
        message: str = "Authentication required.",
        details: dict[str, Any] | None = None,
        code: str = "UNAUTHORISED",
    ) -> None:
        super().__init__(message)
        self.message = message
        self.details = details or {}
        self.code = code
