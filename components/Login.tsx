"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import InputField from "./ui/InputField";
import Button from "./ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, loading, error } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginData = {
      email: formData.email,
      password: formData.password,
    };
    console.log("Login clicked");
    const success = await login(loginData);
    if (success) {
      console.log("Login successful:");
      toast.success("Login successful");
      router.push("/dashboard");
    } else {
      toast.error(
        error === "invalid password" ? "Incorrect email or password" : error
      );
    }
  };

  return (
    <div className="max-w-xl p-10 rounded-lg shadow-lg space-y-4">
      <div className="text-center">
        <h2 className="font-bold text-3xl">Tojumi Admin </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          type="email"
          label="Email"
          placeholder="email@example.com"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputField
          type="password"
          label="Password"
          placeholder="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 px-4"
          disabled={loading}
          loading={loading}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
