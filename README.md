# Testaufgabe Full Stack

## Task

Development of a 'User Management' with an associated data model and a simple frontend

## Description

The task is to design and create a data store of your choice for user and rights management, to manage user accounts and their rights and roles. In addition, you should develop a small service that accesses the data store. The service should be accessible via REST and include routes for:

1. Creating and listing user accounts (Attributes: First name, Last name, Email, Phone number)
2. Creating and deleting roles (Role name)
3. Creating and deleting rights (Name of the right)
4. Assigning one or more roles to a specific user
5. Assigning one or more rights to a role Furthermore, there should be a simple frontend for accessing the application.

After completing the task, the application must be publicly accessible in a Git repository of your choice (such as Github, Bitbucket). The repository should contain all the code needed to create the service, as well as all the code and configuration for the data store of your choice. A README.md file in the root directory of the repository should contain all the steps for creating and maintaining the software.

## Tech Constraints

You should use NodeJS as the technology for the backend/service.
The service should be stateless and accessible via HTTP/REST.
The choice of technology for the data store is up to you.
You should use VueJS as the frontend framework for your application, as well as JavaScript (or TypeScript).

## Hints

To quickly get started with VueJS, we recommend using Vue-CLI: https://github.com/vuejs/vue-cli.

Our frontend applications currently use Google Material Design and the following VueJS libraries: https://quasar.dev/ or https://vuetifyjs.com.

_The use of Material Design is not a requirement!_

## Assumptions

- Users, Roles and Rights respectively have a many-to-many relation.
- Roles and Rights can exist independently from users.

## Basic Apprach

- Keep the development effort small.
- Avoid frameworks taking over too much.
- Focus an a local development environment.
- Focus on simplicity in running the application locally.
- Add additional endpoints to the HTTP interface as useful for the UI
- Skip a production ready setup

## Decisions

- Use a relational database - Reason: Seems to be the simplest solution for now.
- Use mysql as database - Reason: none
- Use expressjs as basic http-library - Reason: Seems to be simplest in the setup of the current scenario.
- Use drizzle as ORM - Reason: I have never worked with drizzle and wanted to give it a try.
- Use vuetify as frontend component library - Reason: Ready-made components to create a prototype, material design seems to be interesting.
- Use tanstack/vue-query - Reason: Easy to integrate with vuejs

## Basic Structure

### Backend

### Frontend

The frontend structure follows the vuetify-create scaffolding for a fast setup.
There are no significant components, everything is put in the existing three pages.

## Local Development Setup

_Prerequisite: The local environment was tested on a Windows machine inside WSL with a the docker version 27.0.3._

- Checkout the repository locally
- Install docker including compose
- Run docker compose

```bash
git clone https://github.com/markusneuy/assignment.git

cd assignment

docker compose up
```

The api part is then reachable on [localhost:8081](http://localhost:8081) the frontend could be accessed via [localhost:3000](http://localhost:3000) and a database connection could be set up using `localhost:3306`.

**For the application to work the database migrations have to be executed once - see below**

### Migrations

The database comes without any tables (the database itself should be created).
To create the respective database structure run the migrations as seen below.

#### Execute a migration

```bash
docker compose exec api npm run runMigrations
```

## Development

To change the code run the local development environment. Then start changing code. Usually the backend and frontend should update automacially. Some changes might require restarting docker compose and building the image again (e.g. new npm packages). This could be done by stopping docker compose and then run the following command.

```bash
docker compose up --build
```

### Local Environment

#### Create a migration

To create new migrations during development execute the following command with a running `docker compose` setup.

```bash
docker compose exec api npm run createMigration
```

## Missing parts

This is a raw unordered list of parts that might be missing.

- Proper linting
- Tests
- Logging
- Validation
- API Documentation (e.g. Open API)
- Security mechanisms (authentication, authorization, secure configs)
- An application structure in frontend and backend that is maintainable and expandable.
- Possible uniqueness on user emails, role and right names
- A production setup, ways of deployment
