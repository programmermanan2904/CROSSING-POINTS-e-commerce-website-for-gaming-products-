import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Server not responding");
    }
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Server not responding");
    }
  }
};
