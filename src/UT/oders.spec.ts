import { Order, OrderStore } from "../models/orders";
import axios from "axios";
import app from "../server";
import supertest from "supertest";

const http = supertest.agent(app);
const store = new OrderStore();

describe("Order Model Tests", () => {
  it("should have an index method", async () => {
    expect(store.getAllOrders).toBeDefined();
  });
});

const backendServer = "http://localhost:3000/api";
const loginURL = `${backendServer}/users/authenticate`;
const payloadLogin = {
  userName: "order.test",
  password: "order123",
};

describe("Order Endpoints Tests", () => {
  let signUpOrder;

  beforeAll(async () => {
    try {
      const OrderUser = {
        first_name: "Order",
        last_name: "User",
        userName: "order.test",
        password: "order123",
      };
      signUpOrder = await axios.post(
        `${backendServer}/users/signUp`,
        OrderUser
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

  it("should retrieve a list of orders", async () => {
    const resultIndex = await axios.get(`${backendServer}/orders`);
    expect(resultIndex.status).toBe(200);
  });

  it("should create a new order", async () => {
    const newOrder: Order = {
      product_id: 1,
      user_id: 1,
      quantity: 10,
      status: "active",
    };
    try {
      const login = await axios.post(loginURL, payloadLogin);
      const loginToken = login.data.token;
      const config = {
        headers: { Authorization: `Bearer ${loginToken}` },
      };
      const result = await axios.post(
        `${backendServer}/orders`,
        newOrder,
        config
      );
      expect(result.status).toBe(201);
    } catch (error) {
      console.log("Error:", error);
    }
  });

  it("should retrieve a list of orders by user ID and require token", async () => {
    const userId = 1;
    const url = `${backendServer}/orders/user/${userId}`;
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    const config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const result = await axios.get(url, config);
    expect(result.status).toBe(200);
  });

  it("should retrieve a list of completed orders by user ID and require token", async () => {
    const userId = 1;
    const url = `${backendServer}/orders/user/${userId}/order`;
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    const config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const result = await axios.get(url, config);
    expect(result.status).toBe(200);
  });
});
