// src/api/todoService.ts
import axios from "axios";

const API_URL = "http://localhost:3000/todos";

export const getTodos = async (token: string) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createTodo = async (todo: any, token: string) => {
  const res = await axios.post(API_URL, todo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateTodo = async (id: number, todo: any, token: string) => {
  const res = await axios.patch(`${API_URL}/${id}`, todo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTodo = async (id: number, token: string) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
