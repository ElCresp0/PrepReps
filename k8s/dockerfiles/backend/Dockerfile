# k8s/dockerfiles/backend/Dockerfile

FROM ruby:3.4.10-slim

RUN apt-get update -qq && apt-get install -y build-essential postgresql-client libpq-dev

WORKDIR /app

# Install gems
COPY backend/Gemfile* ./
RUN bundle install

# Copy application code
COPY backend .

# Expose port and start server
EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]