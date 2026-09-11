import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const classifyArticle = async (text) => {
  const response = await api.post('/classify', { text });
  return response.data;
};

export const getHistory = async (category = null) => {
  const params = category ? { category } : {};
  const response = await api.get('/history', { params });
  return response.data;
};

export const clearHistory = async () => {
  const response = await api.delete('/history');
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getModelInfo = async () => {
  const response = await api.get('/model-info');
  return response.data;
};
