FROM python:3.12-slim AS builder

WORKDIR /build

RUN pip install --no-cache-dir setuptools wheel

COPY pyproject.toml ./

RUN pip install --no-cache-dir --prefix=/install .

FROM python:3.12-slim AS runtime

WORKDIR /app

COPY --from=builder /install /usr/local

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
