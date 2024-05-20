# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

### Products

- **Index**:
  - `GET /products`
  - Returns a list of all products available in the project.

- **Show**:
  - `GET /product/:id`
  - Returns details of a specific product by its ID.

- **Create** [token required]:
  - `POST /products`
  - Requires a token.
  - Creates a new product.

- **Products by Category** (optional):
  - `GET /products/category/:category`
  - Returns a list of products filtered by category.
  - Does not require a token.

### Users

- **Index** [token required]:
  - `GET /users`
  - Requires a token.
  - Returns a list of all users.

- **SignUp**:
  - `POST /signUp`
  - Allows a new user to sign up and receive a token for authentication.

- **Show** [token required]:
  - `GET /users/:id`
  - Requires a token.
  - Returns details of a specific user by their ID.

- **Create** [token required]:
  - `POST /users`
  - Requires a token.
  - Creates a new user.

- **Login**:
  - `POST /authenticate`
  - Allows a user to log in and receive a token for authentication.

### Orders

- **Current Order by User** [token required]:
  - `GET /orders/user/:userId`
  - Requires a token.
  - Returns the current order for a user by their user ID.

- **Completed Orders by User** (optional) [token required]:
  - `GET /orders/user/:userId/order`
  - Requires a token.
  - Returns completed orders for a user by their user ID.

- **Update Order Status**:
  - `PUT /orders/:id`
  - Updates the status of an order from active to complete.
  - Does not require a token.

- **Create Order**:
  - `POST /orders`
  - Allows a user to create a new order.
  - Does not require a token.

- **List of Orders**:
  - `GET /orders`
  - Returns a list of all orders.
  - Does not require a token.

## Data Shapes

### Product

- `id` SERIAL PRIMARY KEY
- `name` VARCHAR(40)
- `price` INTEGER
- `category` (optional)

### User

- `id` SERIAL PRIMARY KEY
- `firstName` VARCHAR(50)
- `lastName` VARCHAR(50)
- `user_name` VARCHAR(50) UNIQUE
- `password` TEXT

### Order

- `id` SERIAL PRIMARY KEY
- `product_id` BIGINT
- `quantity` INTEGER
- `user_id` BIGINT
- `status` VARCHAR(10)

### Order Product

- `order_id` BIGINT
- `product_id` BIGINT
- FOREIGN KEY (`order_id`) REFERENCES `orders(id)` ON DELETE CASCADE ON UPDATE CASCADE
- FOREIGN KEY (`product_id`) REFERENCES `products(id)` ON DELETE CASCADE ON UPDATE CASCADE
- PRIMARY KEY (`order_id`, `product_id`)