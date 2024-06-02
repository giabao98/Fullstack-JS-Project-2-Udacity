import { UserStore } from "../models/users";
import dotenv from "dotenv";
import app from "../server";
import supertest from "supertest";
import axios from "axios";

const http = supertest.agent(app);
const backendServer = "http://localhost:3000/api";
dotenv.config();
const store = new UserStore();

describe("User Model Tests", () => {
  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a showInfo method", () => {
    expect(store.showUserInfo).toBeDefined();
  });

  it("should have a create User method", () => {
    expect(store.createUser).toBeDefined();
  });

  it("should have an authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });
});

describe("User Endpoint Tests", () => {
  const loginURL = `${backendServer}/users/authenticate`;
  const payloadLogin = {
    userName: "user.test",
    password: "userTest123",
  };
  let newUser;
  let token;
  let config: object;

  beforeAll(async () => {
    try {
      const createdUser = {
        first_name: "Login",
        last_name: "User",
        userName: "user.test",
        password: "userTest123",
      };
      newUser = await axios.post(`${backendServer}/users/signUp`, createdUser);
      token = newUser.data.token;
      config = {
        headers: { Authorization: `Bearer ${token}` },
      };
    } catch (error) {
      console.log("Error in beforeAll: ", error);
    }
  });

  it("should test login method return token", async () => {
    const result = await axios.post(loginURL, payloadLogin);
    expect(result.data.token).toBeDefined();
  });

  it("should let user sign up successfully", async () => {
    const signUpUser = {
      first_name: "Lionel",
      last_name: "Messi",
      userName: "lionel.messi",
      password: "udacity_password",
    };
    const url = `${backendServer}/users/signUp`;
    const result = await axios.post(url, signUpUser);
    expect(result.status).toBe(201);
  });

  it("should require token for Index and return value", async () => {
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    const config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const indexValue = await axios.get(`${backendServer}/users`, config);
    expect(indexValue.status).toBe(200);
  });

  it("should let user create a new user successfully and require token", async () => {
    const signUpUser = {
      first_name: "Cristiano",
      last_name: "Ronaldo",
      userName: "cristiano.ronaldo",
      password: "cr7",
    };
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    const config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const url = `${backendServer}/users/`;
    const result = await axios.post(url, signUpUser, config);
    expect(result.status).toBe(201);
  });

  it("should show user info and require token", async () => {
    const login = await axios.post(loginURL, payloadLogin);
    const loginToken = login.data.token;
    const config = {
      headers: { Authorization: `Bearer ${loginToken}` },
    };
    const userId = 1;
    const indexValue = await axios.get(
      `${backendServer}/users/${userId}`,
      config
    );
    expect(indexValue.data.data.id).toEqual(userId);
  });
});
