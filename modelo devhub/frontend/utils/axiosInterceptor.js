import axios from 'axios';

let isInterceptorSetup = false;

export default function setupAxiosInterceptors() {
  if (isInterceptorSetup) return;

  // Define URL base para todas as chamadas axios se configurado
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  axios.defaults.baseURL = apiUrl;

  // Interceptor de Requisição: Adiciona o Token JWT no cabeçalho Authorization
  axios.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Interceptor de Resposta: Tratamento de erros globais (como 401 não autorizado)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (typeof window !== 'undefined' && error.response && error.response.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
      return Promise.reject(error);
    }
  );

  isInterceptorSetup = true;
}
