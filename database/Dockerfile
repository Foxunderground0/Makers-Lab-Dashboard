# Use the official PostgreSQL image as a base
FROM postgres:latest

# Set environment variables for PostgreSQL
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword
ENV POSTGRES_DB=mydatabase

# Expose PostgreSQL port
EXPOSE 5432

# Create a volume for storing PostgreSQL data
VOLUME /var/lib/postgresql/data