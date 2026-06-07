# Use the official Python image
FROM python:3.9

# Set the working directory inside the cloud computer
WORKDIR /app

# Copy your requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app's code
COPY . .

# Hugging Face Spaces requires apps to run on port 7860
ENV PORT=7860
EXPOSE 7860

# Start the Python server
CMD ["python", "app.py"]