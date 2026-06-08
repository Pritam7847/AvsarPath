FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system deps required for some Python packages and spaCy
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ curl build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy and install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model (baked into image)
RUN python -m spacy download en_core_web_sm

# Copy app source
COPY . /app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
