# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /code

# Install dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy Django project files
COPY . /code/

# Default command
CMD ["gunicorn", "fishingapp.wsgi:application", "--bind", "0.0.0.0:8000"]
