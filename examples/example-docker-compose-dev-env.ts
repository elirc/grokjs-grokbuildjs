/*
Example: docker-compose for Consistent Local Development

version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  api:
    build: ./backend
    depends_on: [db]
    environment:
      DATABASE_URL: postgres://postgres:dev@db:5432/postgres
    ports:
      - "3001:3001"

Volumes and networks created by compose give every developer the exact same environment.

A junior should use docker-compose up for any service that requires a database or other infrastructure. It eliminates "works on my machine" problems.
*/
