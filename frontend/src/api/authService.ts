import axios from "axios";

const API_URL = "http://localhost:3000/authentication";

export const registerUser = async (data: any) => {
  return await axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (data: any) => {
  return await axios.post(`${API_URL}/login`, data);
};
