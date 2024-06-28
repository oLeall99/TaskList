// Só usuários podem acessar:

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";

import { AuthTokenError } from "@/services/erros/AuthTokenError";


// Função para páginas que somente usuários com login podem acessar:
export function canSSRAuth<P extends { [key: string]: any; }>(fn: GetServerSideProps<P>){
    return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);
        const token = cookies['@taskauth.token'];

        // Caso usuário não tenha realizado login retorna ele para a tela inicial:
        if(!token){
            return{
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }

        try{
            return await fn(ctx);
        }catch(err){
            // Caso ocorra algum erro redireciona o usuário e limpa o cookie
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@taskauth.token')
            }

            return{
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }


        
   }
}