# Storefront Backend Project

### Steps to Set Up the Project

1. **Install Project Dependencies**:
   Run `npm i` to install all necessary dependencies.

2. **Set Up PostgreSQL**:
   Create a PostgreSQL database with the following credentials or adjust as needed:
   - **Database**: postgres
   - **Username**: postgres
   - **Password**: udacity_password

   Alternatively, you can create a new database and user. For example:
   - **Database**: udacity
   - **Username**: udacity_user
   - **Password**: udacity_password

3. **Create Required Databases**:
   Use the same credentials to create two databases:
   - For development:
     ```sql
     CREATE DATABASE udacity;
     ```
   - For testing:
     ```sql
     CREATE DATABASE udacity_db_test;
     ```

4. **Run Database Migrations**:
   Execute `db-migrate up` to create the necessary tables for the project. This command uses the `ENV` environment variable to determine which database to apply the migrations to. By default, `ENV` is set to "dev", which targets the development database (udacity).

5. **Run Tests**:
   To execute the tests, use `npm run test`. This command will use the test database and you can check the results in the output. The `package.json` file sets the `ENV` variable to `test` for testing purposes.

6. **Run the Application in Development Mode**:
   Use `npm run watch` to start the application in development mode. You can then use Postman or a similar tool to test the endpoints.

7. **Default Ports**:
   - Backend runs on: `localhost:3000`
   - PostgreSQL runs on: `localhost:5432`

8. **Routes and Handlers**:
   All route handlers are located in the `models` folder.

9. **Authentication Middleware**:
   The `middleware` folder contains a method to authenticate tokens.

### Additional Information

A middleware for token verification has been added in the `middleware` folder. Running the `db-migrate up` command will create the necessary databases.

### Environment Variables

Set the following environment variables for the project:

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=udacity
POSTGRES_USER=udacity_user
POSTGRES_PASSWORD=udacity_password
POSTGRES_DB_TEST=udacity_db_test
BCRYPT_PASSWORD=udacity-bcrypt
SALT_ROUND=5
SECRET_TOKEN=helloUdacity!
ENV=dev
```
