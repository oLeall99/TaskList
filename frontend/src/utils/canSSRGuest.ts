// Usuários não logados podem acessar:

import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// Função para paginas que só usuários visitantes ( sem login ) podem acessar:
export function canSSRGuest<P extends { [key: string]: any; }>(fn: GetServerSideProps<P>){
    return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);
        // Caso o usuário já logado tente acessar essas páginas:
        if(cookies['@taskauth.token']){
            // Redireciona o usuário para o dashboard
            return{
                redirect: {
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }


        return await fn(ctx);
    }
}