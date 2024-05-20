/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    product_id integer ,
    user_id integer,
    quantity integer,
    status VARCHAR(10),
    CONSTRAINT fk_user_order FOREIGN KEY (user_id) REFERENCES users(id)
);
