# Zurich Micro Service Technical Assessment

This project provides an API for managing products. The API includes endpoints for creating, fetching, updating, and removing products. It uses NestJS and integrates Swagger for API documentation. Role-based access control is implemented to restrict certain operations to admin users only.

## Entities

The `PRODUCT` entity for this project is structured as follows:

- `id`: Serves as a unique identifier for each product. It is a UUID and is used as the primary key, ensuring each product is uniquely identifiable even though productCode alone is not unique.
- `productCode`: A column to store the code for the product. This column is not unique and can be shared among different products, depending on their location.
- `productDesc`: A nullable column used to store the product description. This field is optional and may be omitted when creating a new product.
- `location`: A column that stores the location associated with the product. This value is used to determine the premium price and is crucial for distinguishing products that have the same productCode but are in different locations.
- `price`: A column that stores the price of the product. This value represents the cost of the product at the specified location.

## Schemas

The schemas for the models as follows:-

<b>1. Create Operation:</b>

- Fields Required: productCode, location, and price.
  - Location: This field has a specific type constraint and can only accept values "West Malaysia" or "East Malaysia". This ensures that only valid locations are provided when creating a new product.
    - Description: The location field is restricted to these predefined values to maintain data consistency and avoid invalid entries.

<b>2. Update Operation:</b>

- Fields Required: location and price.
  - Description: When updating a product, only the location and price can be modified. This ensures that other attributes like productCode remain unchanged, preserving the integrity of the product’s identity.

## Controller

<b>1. Create Product</b>

- Endpoint: `POST /products/create`
- Description: Creates a new product.
- Authorization: Requires admin access.
- Request Body:

  ```json
  {
    "productCode": 1000,
    "location": "West Malaysia",
    "price": 300
  }
  ```

- Responses:
  - `201 Created`: Product successfully created.
  - `401 Unauthorized`: Access denied, admin role required.
  - `409 Conflict`: Product with the same location and product code already exists.

<b>2. Fetch Product</b>

- Endpoint: `GET /products/get`
- Description: Fetches a product by product code and location.
- Query Parameters:
  - `productCode` (number): The product code to search for.
  - `location` (string): The location of the product. Allowed values are "West Malaysia" or "East Malaysia".
- Responses:
  - `200 OK` : Product found.
  - `401 Unauthorized`: Access denied.
  - `404 Not Found` : Product not found.

<b>3. Update Product</b>

- Endpoint: `PUT /products/update`
- Description: Updates a product's information.
- Authorization: Requires admin access.
- Query Parameters:
  - `productCode` (number): The product code of the product to be updated.
- Request Body:
  ```json
  {
    "location": "East Malaysia",
    "price": 450
  }
  ```
- Responses:

  - `201 Created` : Product successfully updated.
  - `401 Unauthorized` : Access denied, admin role required.
  - `404 Not Found` : Product not found.

<b>4. Remove Product </b>

- Endpoint: `DELETE /products/remove`
- Description: Removes a product.
- Authorization: Requires admin access.
- Query Parameters:
  - `productCode` (number): The product code of the product to be removed.
- Responses:
  - `201 Created` : Product successfully removed.
  - `401 Unauthorized` : Access denied, admin role required.
  - `404 Not Found` : Product not found.

### Error Handling

- `UnauthorizedException` : Thrown when a user without admin privileges tries to access restricted routes.
- `ConflictException` : Thrown when trying to create a product with an existing product code and location.
- `NotFoundException` : Thrown when the requested product is not found.

## Service

The `ProductsService` class provides methods for managing products, including creation, retrieval, updating, and removal. This service integrates with TypeORM for data persistence and includes validation and error handling for various operations.

### Method

<b>1. Create Product </b>

- Method: `create(createProductDto: CreateProductDto): Promise<Product>`
- Description: Creates a new product.
- Parameters:
  - `createProductDto`: The DTO containing product details such as productCode, location, and price.
- Returns: A promise that resolves to the created Product.
- Exceptions:

  - `BadRequestException` : Thrown if the provided location is not valid. Allowed locations are "West Malaysia" and "East Malaysia".
  - `ConflictException` : Thrown if a product with the same location and product code already exists.

<b>2. Find One Product </b>

- Method: `findOne(productCode: number, location: ProductLocation): Promise<Product>`
- Description: Retrieves a product by its product code and location.
- Parameters:
  - `productCode` : The code of the product.
  - `location` : The location of the product. Allowed values are "West Malaysia" or "East Malaysia".
- Returns: A promise that resolves to the Product if found.
- Exceptions:
  - `NotFoundException` : Thrown if no product code or location is provided, or if the product is not found.

<b> 3. Update Product</b>

- Method: `update(productCode: number, updateProductDto: UpdateProductDto): Promise<Product>`
- Description: Updates the details of an existing product.
- Parameters:
  - `productCode` : The code of the product to be updated.
  - `updateProductDto` : The DTO containing updated information such as location and price.
- Returns: A promise that resolves to the updated Product.
- Exceptions:
  - `NotFoundException` : Thrown if no product code is provided, or if the product is not found.

<b>4. Remove Product </b>

- Method: `remove(productCode: number): Promise<void>`
- Description: Removes a product from the database.
- Parameters:
  - `productCode` : The code of the product to be removed.
- Returns: A promise that resolves when the product is successfully removed.
- Exceptions:
  - `NotFoundException` : Thrown if no product code is provided, or if the product is not found.

## JWT Strategy

The JwtStrategy class is a NestJS strategy used for handling JWT authentication. It integrates with Passport.js to validate JWT tokens and extract user information.

### Overview

The JwtStrategy class is responsible for:

1. Extracting JWT Tokens: Retrieves the token from the `Authorization` header in the `Bearer` format.
2. Validating Tokens: Uses the JWT secret to verify the token’s authenticity and expiration.
3. Extracting User Information: Extracts user details (subject, username, role) from the token payload.

### Configuration

<b>1. Register Strategy in Module</b>

Add the JwtStrategy to your module’s providers. For example, in app.module.ts:

```typescript
import { Module, NestModule } from "@nestjs/common";
import { JwtStrategy } from "./jwt/jwt.strategy";

@Module({
  providers: [JwtStrategy],
})
export class AppModule implements NestModule {}
```

<b>2. Define JWT Secret </b>

Ensure that your .env file contains the JWT secret used for token verification:

```env
JWT_SECRET=your-secret-key
```

To generate the secret, can run the command in the terminal:

```bash
openssl rand -base64 32
```

### Strategy Behavior

- Extracting JWT Tokens:

  - The strategy extracts the JWT token from the `Authorization` header in the format `Bearer <token>` .

- Validating Tokens:

  - The token is validated using the configured `secretOrKey (process.env.JWT_SECRET)` .
  - The token’s expiration is checked, and if expired, it is rejected.

- Extracting User Information:

  - The validate method extracts the user’s `sub` (subject), `username`, and `role ` from the token payload and returns them.
  - This information is then used by role middleware and controllers to perform authorization checks.

### Error Handling

- Invalid or Expired Token:

  - If the token is missing, invalid, or expired, the `JwtStrategy` will throw an authentication error.

- Unauthorized Access:

  - Users will be denied access to protected routes if they do not provide a valid JWT token.

## Role Middleware

The `RoleMiddleware` class is a NestJS middleware used to handle role-based access control by validating JWT tokens. This middleware checks the authenticity of tokens and ensures that users have the necessary roles to access certain routes.

### Overview

The RoleMiddleware class performs the following tasks:

1. `Validates JWT Token` : Checks if the request contains a valid JWT token.
2. `Extracts User Role` : Retrieves the user's role from the token and attaches it to the request.
3. `Role-Based Access Control` : Ensures that only users with the "admin" role can access non-GET routes.

### Middleware Usage

<b>1. Register Middleware: </b>

Add the middleware to your module’s configuration. For example, in app.module.ts:

```typescript
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { RoleMiddleware } from "./role.middleware";

@Module({
  imports: [
    // other imports
  ],
  // providers, controllers
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RoleMiddleware)
      .exclude("/products/get")
      .forRoutes("/products/create", "/products/update", "/products/remove");
  }
}
```

<b>2. Define JWT Secret </b>

Ensure that your .env file contains the JWT secret used for token verification:

```env
JWT_SECRET=your-secret-key
```

To generate the secret, can run the command in the terminal:

```bash
openssl rand -base64 32
```

### Middleware Behavior

- Token Validation:

  - The middleware checks for the Authorization header in the request.
  - It expects the header to be in the format Bearer `<token>` .
  - If the token is missing or invalid, an UnauthorizedException is thrown.

- Role Extraction:

  - The JWT token is decrypted and verified using the configured secret.
  - The user role is extracted from the token and attached to the request as `req.userRole` .

- Access Control:

  - For routes that are not GET requests, the middleware checks if the user has the "admin" role.
  - If the user does not have the required role, an `UnauthorizedException` is thrown.

### Error Handling

- UnauthorizedException:

  - Thrown if no token is provided, if the token is invalid, if no role is found in the token, or if the user does not have the required role.

### Features Tested

1. Valid Admin Token: Grants access when a valid JWT with the admin role is provided.

2. No Token Provided: Throws an `UnauthorizedException` when no token is present in the request headers.

3. Invalid Token Format: Throws an `UnauthorizedException` when the JWT format is invalid.

4. Expired or Invalid Token: Throws an `UnauthorizedException` when the JWT is expired or otherwise invalid.

5. Missing Role in Token: Throws an `UnauthorizedException` if the JWT is missing the role field.

6. Non-Admin Access to Admin Route: Denies access when a non-admin user tries to access admin-protected routes.

7. Allow GET Requests for Non-Admin Users: Allows non-admin users to make GET requests, as these are considered public routes.

## Unit Test

### ProductController Tests

The tests cover endpoints for product creation, specifically ensuring that JWT authentication and role-based access control are functioning as expected.

### Overview

The tests for the `ProductsController` validate:

1. Successful Product Creation: When a valid JWT token with an admin role is provided.
2. Access Denial: When an invalid JWT token or a token with a user role is used.

### Testing Setup

1. Dependencies:

   - `@nestjs/testing` : For creating and initializing the NestJS testing module.

   - `supertest` : For making HTTP requests to the application.

   - `@nestjs/jwt` : For handling JWT functionality.

2. Application Initialization:
   - The tests use the main application module `(AppModule)` to initialize the NestJS application.
   - `JwtService` is mocked to simulate JWT functionality.

### Test Cases

1. Should Create a Product with Valid JWT Token and Admin Role

   - Description: This test ensures that a product can be created when a valid JWT token with the admin role is provided.
   - Endpoint: `POST /products/create`
   - Request Headers:
     - Authorization: `Bearer <valid-token>`
     - Accept: `*/*`
   - Request Body

   ```json
   {
     "productCode": 9000,
     "location": "West Malaysia",
     "price": 1
   }
   ```

   - Expected Response:
     - Status Code: 201
     - Body: The created product data, including `productCode`, `location`, and `price` .

2. Should Deny Access with Invalid JWT Token or User Role

   - Description: This test ensures that access is denied when an invalid JWT token or a token with a user role is used.
   - Endpoint: `POST /products/create`
   - Request Headers:

     - Authorization: `Bearer <invalid-token>`
     - Accept: `*/*`

   - Request Body
     ```json
     {
       "productCode": 9000,
       "location": "West Malaysia",
       "price": 1
     }
     ```

- Expected Response:
  - Status Code: 401
  - Body: Error message indicating "Invalid or expired token".

3. Should throw an `InternalServerErrorException` if an error occurs

- Description: The test case aims to confirm that the create method appropriately handles errors by throwing an `InternalServerErrorException`. This is crucial for ensuring that the API responds correctly in the event of service failures

- Endpoints:

  - `POST /products/create`
  - `GET /products/get`
  - `PUT /products/update`
  - `DELETE /products/remove`

- Request Body
  ```json
  {
    "productCode": 7000,
    "location": "West Malaysia",
    "price": 650.55
  }
  ```
- Expected Response:

  - Status Code: 500
  - Body: Error message.

### ProductService Unit Tests

The tests cover various functionalities of the `ProductsService`, including creating, fetching, updating, and removing products. Each test case ensures that the service methods behave correctly under different scenarios.

### Overview

The tests for the ProductsService include:

1. `Creating a New Product` : Validating successful creation, handling invalid location, and checking for duplicate products.
2. `Fetching a Product` : Handling scenarios with missing parameters, successfully fetching a product, and throwing errors for non-existent products.
3. `Updating a Product` : Handling missing product codes, successfully updating a product, and verifying the updates.
4. `Removing a Product` : Handling missing product codes, checking for non-existent products, and ensuring successful removal.

### Test Cases

<b>1. Creating a new product</b>

- Test: Create a New Product

  - Description: Ensures that a product is created successfully with valid input.
  - Input:

    ```json
    {
      "productCode": 1000,
      "location": "West Malaysia",
      "price": 300
    }
    ```

  - Expected Outcome: Product is created and returned with an ID.

- Test: Invalid Location

  - Description: Throws a `BadRequestException` if the location is invalid.
  - Input:

    ```json
    {
      "productCode": 1000,
      "location": "West",
      "price": 300
    }
    ```

  - Expected Outcome: Throws a `BadRequestException` .

- Test: Duplicate Product

  - Description: Throws a `ConflictException` if a product with the same location and product code already exists.
  - Input:

    ```json
    {
      "productCode": 1000,
      "location": "West Malaysia",
      "price": 300
    }
    ```

  - Expected Outcome: Throws a `ConflictException`.

<b>2. Fetching a Product</b>

- Test: Missing Parameters

  - Description: Throws a `BadRequestException` if neither productCode nor location is provided.
  - Input:

    ```json
    {
      "productCode": null,
      "location": null
    }
    ```

  - Expected Outcome: Throws a `BadRequestException`.

- Test: Successfully Fetch Product

  - Description: Fetches a product successfully when valid parameters are provided.
  - Input:

    ```json
    {
      "productCode": 1000,
      "location": "West Malaysia"
    }
    ```

  - Expected Outcome: Returns the product details.

- Test: Product Not Found

  - Description: Throws a `NotFoundException` if the product is not found.
  - Input:
    ```json
    {
      "productCode": 2000,
      "location": "West Malaysia"
    }
    ```
  - Expected Outcome: Throws a `NotFoundException`.

<b>3. Updating a Product </b>

- Test: Missing Product Code

  - Description: Throws a `BadRequestException` if no productCode is provided.
  - Input:
    ```json
    {
      "location": "West Malaysia",
      "price": 350
    }
    ```
  - Expected Outcome: Throws a `BadRequestException`.

- Test: Successfully Update Product

  - Description: Updates the product successfully when valid data is provided.
  - Input:
    ```json
    {
      "productCode": 1000,
      "location": "West Malaysia",
      "price": 350
    }
    ```
  - Expected Outcome: Returns the updated product details.

<b>4. Removing a Product </b>

- Test: Missing Product Code

  - Description: Throws a `BadRequestException` if no productCode is provided.
  - Input:

    ```json
    {
      "productCode": null
    }
    ```

  - Expected Outcome: Throws a `BadRequestException` .

- Test: Product Not Found

  - Description: Throws a `NotFoundException` if no product is found with the provided productCode.
  - Input:

    ```json
    {
      "productCode": 1000
    }
    ```

  - Expected Outcome: Throws a `NotFoundException` .

- Test: Successfully Remove Product

  - Description: Successfully removes a product if it exists.
  - Input:
    ```json
    {
      "productCode": 1000
    }
    ```
  - Expected Outcome: Removes the product and resolves without errors.

## Steps to Test Endpoint in Swagger UI

1. Create .env file to configure Postgres and JWT at the root level. The information as follows:

   ```.env
   DB_TYPE=
   DB_HOST=
   DB_PORT=
   DB_USERNAME=
   DB_PASSWORD=
   DB_NAME=
   DB_SYNCHRONIZE=true

   API_PORT=3000
   DB_PORT=5432

   JWT_SECRET=
   ```

   Run this command in the terminal to generate JWT_SECRET

   ```bash
    openssl rand -base64 32
   ```

2. Run this command

   ```zsh
   npm run start
   ```

3. Then, redirect to `localhost:3000`

4. Insert the generated token into the Authorization section in Swagger to authenticate and test the protected endpoint.

### Steps to generate JWT token

1. Before executing the command, ensure to update the role and username values in the code to match your requirements. To generate a token for a role that is not "admin", simply replace "admin" with your desired role.

   ```javascript
   // replace the role and username before generating the token
   var token = jwtService.sign({
     username: "admin",
     role: "admin",
     sub: "12345",
   });
   ```

2. Run this command

   ```node.js
     node src/jwt/generate-token.js
   ```

For the sample `JWT_SECRET` key can refer to the document attached in the email.
