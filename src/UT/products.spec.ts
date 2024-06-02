import { ProductStore } from "../models/products";
import dotenv from "dotenv";
import axios from "axios";
import app from "../server";
import supertest from "supertest";

const http = supertest.agent(app);
const backendServer = "http://localhost:3000/api";
dotenv.config();
const store = new ProductStore();

describe("Product Model Tests", () => {
  it("should have an index method", () => {
    expect(store.getAllProducts).toBeDefined;
  });

  it("should have a showInfo method", () => {
    expect(store.getProductById).toBeDefined();
  });

  it("should have a create Product method", () => {
    expect(store.createNewProduct).toBeDefined();
  });

  it("should have a getProductByCategory method", () => {
    expect(store.getProductsByCategory).toBeDefined();
  });
});

describe("Product Endpoint Tests", () => {
  let signUpProduct;
  const loginURL = `${backendServer}/users/authenticate`;
  const payloadLogin = {
    userName: "product.test",
    password: "product123",
  };

  beforeAll(async () => {
    try {
      const ProductUser = {
        first_name: "Product",
        last_name: "User",
        userName: "product.test",
        password: "product123",
      };
      signUpProduct = await axios.post(
        `${backendServer}/users/signUp`,
        ProductUser
      );
    } catch (error) {
      console.log("Error:", error);
    }

    try {
      const newProduct = {
        name: "Macbook",
        price: 200000,
        category: "Laptop",
      };
      const login = await axios.post(loginURL, payloadLogin);
      const loginToken = login.data.token;
      const config = {
        headers: { Authorization: `Bearer ${loginToken}` },
      };
      await axios.post(`${backendServer}/products`, newProduct, config);
    } catch (err) {
      console.log("Error:", err);
    }
  });

  it("should return a list of products successfully", async () => {
    const result = await axios.get(`${backendServer}/products`);
    expect(result.status).toBe(200);
  });

  it("should return product info by product id", async () => {
    const productId = 1;
    const result = await axios.get(`${backendServer}/products/${productId}`);
    expect(result.status).toBe(200);
  });

  it("should create a new product and require token", async () => {
    const newProduct = {
      name: "Macbook",
      price: 200000,
      category: "Laptop",
    };
    const url = `${backendServer}/products/`;
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    const config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const result = await axios.post(url, newProduct, config);
    expect(result.status).toBe(201);
  });

  it("should get a list of products by category", async () => {
    const categoryName = "Laptop";
    const listProduct = await axios.get(
      `${backendServer}/products/category/${categoryName}`
    );
    expect(listProduct.data.data[0].category).toEqual(categoryName);
  });
});
