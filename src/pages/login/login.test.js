import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserApi } from "../../apis/Api";
import Login from "../login/Loginpage";
import '@testing-library/jest-dom/extend-expect';

jest.mock("../../apis/Api");

describe("Login Component Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    global.Storage.prototype.setItem = jest.fn();
    // Mock window.location.href
    delete window.location;
    window.location = { href: "" };
  });

  it("Should login successfully and redirect to home page", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const mockResponse = {
      data: {
        success: true,
        message: "Login successful",
        token: "dummyToken",
        userData: { isAdmin: false },
      },
    };

    loginUserApi.mockResolvedValue(mockResponse);
    toast.success = jest.fn();

    const email = screen.getByPlaceholderText("Enter your email address");
    const password = screen.getByPlaceholderText("Enter your password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(email, { target: { value: "test@gmail.com" } });
    fireEvent.change(password, { target: { value: "test123" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "test123",
      });
      expect(toast.success).toHaveBeenCalledWith("Login successful");
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "dummyToken");
      expect(window.location.href).toBe("/");
    });
  });

  

  it("Should show error message on failed login due to incorrect password", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const mockResponse = {
      data: {
        success: false,
        message: "Incorrect password",
      },
    };

    loginUserApi.mockResolvedValue(mockResponse);
    toast.error = jest.fn();

    const email = screen.getByPlaceholderText("Enter your email address");
    const password = screen.getByPlaceholderText("Enter your password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(email, { target: { value: "test@gmail.com" } });
    fireEvent.change(password, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "wrongpassword",
      });
      expect(toast.error).toHaveBeenCalledWith("Incorrect password");
    });
  });

  it("Should show error message on failed login due to incorrect password", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const mockResponse = {
      data: {
        success: false,
        message: "Incorrect password",
      },
    };

    loginUserApi.mockResolvedValue(mockResponse);
    toast.error = jest.fn();

    const email = screen.getByPlaceholderText("Enter your email address");
    const password = screen.getByPlaceholderText("Enter your password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(email, { target: { value: "test@gmail.com" } });
    fireEvent.change(password, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "wrongpassword",
      });
      expect(toast.error).toHaveBeenCalledWith("Incorrect password");
    });
  });

  
});
