FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5100

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5100", "--workers", "2", "--threads", "2", "--timeout", "150"]