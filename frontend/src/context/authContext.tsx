import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import { toast } from 'react-toastify';
import Router from 'next/router';

// Importe da API
import { api } from '@/services/apiClient';

// Tipo para dados do Context
type AuthContextData = {
    user: UserProps | undefined;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
    fetchUserData: () => Promise<void>; 
}

// Tipo para Usuário:
export type UserProps = {
    id: string;
    name: string;
    email: string;
}

// Tipo de valor para Login:
type SignInProps = {
    email: string;
    password: string;
}

// Tipo de valor para Cadastro:
type SignUpProps = {
    name: string;
    email: string;
    password: string;
} 

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

// Função de deslogar o usuário, destruindo seu token:
export function signOut(){
    try{
        // Destroi o token e retorna para tela de login:
        destroyCookie(undefined, '@taskauth.token')
        Router.push('/')
    }catch{
        console.log("Error with signOut")
    }
}

export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user; // Converte o user para boolean

    useEffect(() => {
        // Carrega os dados do usuário ao iniciar
        fetchUserData();
    }, [])

    // Função para buscar dados atualizados do usuário
    async function fetchUserData() {
        try {
            const { '@taskauth.token' : token } = parseCookies();
            if(token){
                const response = await api.get('/user');
                const { id, name, email } = response.data;
                setUser({ id, name, email });
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            signOut(); // Desloga o usuário em caso de erro
        }
    }

    // Função de Login de Usuário:
    async function signIn({email, password}: SignInProps){
        try{
            // Tenta realizar o Login:
            const response = await api.post('/session', { email, password}) 

            const { id, name, token } = response.data; 

            // Cria um cookie
            setCookie(undefined, '@taskauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // Token expira em um mes
                path: "/" // Quais caminhos tem acesso ao cookie
            })

            // Define o Usuário:
            setUser({
                id,
                name, 
                email
            })

            // Define no Headers o token para próximas requisiçoes:
            api.defaults.headers['Authorization'] = `Bearer ${token}`
            toast.success("Login Realizado com Sucesso!")

            // Redireciona o user para /dashboard
            Router.push('/dashboard')

        }catch(err){
            toast.error("Erro ao fazer login.")
            console.log("Error with login", err)
        }
    }
    // Função de Cadastro de Usuário:
    async function signUp({name, email, password}:SignUpProps) {
        try{
            
            // Tenta Realizar o cadastro do novo usuário e redireciona para o login
            const response = await api.post('/user', { name, email, password }) 
            toast.success("Conta Criada com Sucesso!")
            Router.push('/')


        }catch(err){
            toast.error("Erro ao criar conta.")
            console.log("Error with signUp", err)
        }
    }

    // Passa o contexto para todas os componentes que sejam seu children
    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp, fetchUserData}}>
            {children}
        </AuthContext.Provider>
    )
}
