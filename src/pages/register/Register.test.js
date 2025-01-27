import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUserApi } from "../../apis/Api";
import Register from "../register/Registerpage";
import '@testing-library/jest-dom/extend-expect';

jest.mock("../../apis/Api");

describe("Register Component Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should render the Register component correctly", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("First name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Phone number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Create password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("Should show validation errors when fields are empty", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const signUpButton = screen.getByText("Sign Up");

    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText("First name is required!")).toBeInTheDocument();
      expect(screen.getByText("Last name is required!")).toBeInTheDocument();
      expect(screen.getByText("Email is required!")).toBeInTheDocument();
      expect(screen.getByText("Password is required!")).toBeInTheDocument();
      expect(screen.getByText("Confirm password is required!")).toBeInTheDocument();
      expect(screen.getByText("Phone number is required!")).toBeInTheDocument();
    });
  });

 

  it("Should show error when password and confirm password do not match", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Create password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
    const signUpButton = screen.getByText("Sign Up");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "differentpassword" } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.getByText("Password and confirm password do not match")).toBeInTheDocument();
    });
  });

  it("Should successfully register when all fields are valid", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const mockResponse = {
      data: {
        success: true,
        message: "Registration successful",
      },
    };

    registerUserApi.mockResolvedValue(mockResponse);
    toast.success = jest.fn();

    const firstNameInput = screen.getByPlaceholderText("First name");
    const lastNameInput = screen.getByPlaceholderText("Last name");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone number");
    const passwordInput = screen.getByPlaceholderText("Create password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
    const signUpButton = screen.getByText("Sign Up");

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      });
      expect(toast.success).toHaveBeenCalledWith("Registration successful");
    });
  });

  it("Should show error when registration fails", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const mockResponse = {
      data: {
        success: false,
        message: "Registration failed",
      },
    };

    registerUserApi.mockResolvedValue(mockResponse);
    toast.error = jest.fn();

    const firstNameInput = screen.getByPlaceholderText("First name");
    const lastNameInput = screen.getByPlaceholderText("Last name");
    const emailInput = screen.getByPlaceholderText("Email");
    const phoneInput = screen.getByPlaceholderText("Phone number");
    const passwordInput = screen.getByPlaceholderText("Create password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm password");
    const signUpButton = screen.getByText("Sign Up");

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(registerUserApi).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
        phone: "1234567890",
      });
      expect(toast.error).toHaveBeenCalledWith("Registration failed");
    });
  });

  it("Should not call API when validation fails", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const signUpButton = screen.getByText("Sign Up");

    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(registerUserApi).not.toHaveBeenCalled();
    });
  });

  

  it("Should display social login options", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    expect(screen.getByAltText("Facebook")).toBeInTheDocument();
    expect(screen.getByAltText("Google")).toBeInTheDocument();
    expect(screen.getByAltText("Twitter")).toBeInTheDocument();
  });

  
});
