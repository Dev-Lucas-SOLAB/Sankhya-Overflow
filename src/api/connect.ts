import axios from 'axios';

// Função que cria e retorna uma instância do axios
const createApi = () => {
    const api = axios.create({
        baseURL: 'http://172.16.62.119:8280', // Base URL para todas as requisições
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        }
    });

    return api;
}

export default createApi;