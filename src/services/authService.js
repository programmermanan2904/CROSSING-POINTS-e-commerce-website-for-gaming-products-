import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API}/login`, userData);
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
    const response = await axios.post(`${API}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error;
    } else {
      throw new Error("Server not responding");
    }
  }
};
