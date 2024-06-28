import { FormEvent, useContext, useState } from "react";
import { useForm } from 'react-hook-form' 
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify';

// Tipagem do next
import { GetServerSideProps } from "next";

// Componentes do Next
import Head from "next/head";
import Link from "next/link";

// Estilo
import styles from "@/styles/home.module.scss";

// Component
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";

// Context
import { AuthContext } from "@/context/authContext";

// Schema
import { FormLoginData, schemaLogin } from '@/utils/schemas';

// Server Side
import { canSSRGuest } from "@/utils/canSSRGuest";


export default function Home() {
  
  // Validação de Schema:
  const { register, handleSubmit, formState: { errors } } = useForm<FormLoginData>({
    resolver: zodResolver(schemaLogin)
  })

  // Busca a função de login no Context:
  const { signIn } = useContext(AuthContext);

  const [loading, setLoading] = useState(false)

  // Função de Login:
  async function handleLogin(data: FormLoginData) {
    try {
      setLoading(true);

      //Chama a função de Login do Context:
      await signIn(data);
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro with login:", error);
    }
  }

  // Verifica se existem erros e exibe toast
  const onError = (error: any ) => {
    if (error.email) {
      toast.warn(error.email.message);
    }
    if (error.password) {
      toast.warn(error.password.message);
    }
  };

  return (
    <>
      <Head>
        <title>TaskList - Login</title>
      </Head>
      <div className={styles.container}>
        <Logo/>
        <div className={styles.login}>
          <form onSubmit={handleSubmit(handleLogin, onError)}>
            <Input
              placeholder="Digite seu Email..."
              type="text"
              {...register("email")}
              id="email"
            />
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            <Input
              placeholder="Digite sua Senha..."
              type="password"
              {...register("password")}
              id='password'
            />
            {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            
            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>
          </form>
          <Link href="/signup" className={styles.text}>
            <span>Não tem uma conta? cadastre-se</span>
          </Link>
        </div>
      </div>
    </>
  );
}

// Não permite Acessar essa página caso o usuário já tenha um login:
export const getServerSideProps = canSSRGuest(async (ctx) => {
  return{
    props: {}
  }
})
