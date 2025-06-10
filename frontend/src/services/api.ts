import axios, { AxiosError} from 'axios';
import { parseCookies } from 'nookies';
import { AuthTokenError } from './erros/AuthTokenError';
import { signOut } from '@/context/authContext';

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333", // URL da API
        headers: {
            Authorization: `Bearer ${cookies['@taskauth.token']}`
        }
    })

    api.interceptors.response.use(
        response => {
          return response;
        },
        (error: AxiosError) => {
          if (error.response && error.response.status === 401) {
            // Erro 401 (Não Autorizado): 
            if (typeof window !== 'undefined') {
              // Deslogar o usuário
              signOut();
            }else{
                return Promise.reject(new AuthTokenError());
            }
          }
    
          return Promise.reject(error);
        }
    );

    return api;
}