# ================================
# Base stage
# ================================
FROM python:3.11-slim AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY pyproject.toml ./
RUN pip install --no-cache-dir --upgrade pip

# ================================
# Development stage
# ================================
FROM base AS development
COPY . .
RUN pip install --no-cache-dir -e .

# Run as root in dev for easier debugging
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ================================
# Production stage
# ================================
FROM base AS production
COPY . .
RUN pip install --no-cache-dir -e .

# Create non-root user
RUN addgroup --system app && \
    adduser --system --group app && \
    chown -R app:app /app

USER app

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]ubuntu@ip-172-31-26-46:~/cvailor$ 
