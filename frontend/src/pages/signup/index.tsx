import { useForm } from 'react-hook-form' 
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify';

// Component do Next
import Head from "next/head";
import Link from "next/link";

// Estilo
import styles from "@/styles/home.module.scss";

// Componentes
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { Logo } from "@/components/logo";

import { AuthContext } from "@/context/authContext"

// Schema
import { FormSignUpData, schemaSignUp } from '@/utils/schemas';
import { useContext, useState } from 'react';

export default function SignUp() {
  
  // Validação de Schema:
  const { register, handleSubmit,  formState: { errors } } = useForm<FormSignUpData>({
    resolver: zodResolver(schemaSignUp)})

  // Busca a função de cadastro no Context:
  const { signUp } = useContext(AuthContext);

  const [loading, setLoading] = useState(false)

  // Função de Cadastro:
  async function handleSignUp(data: FormSignUpData) {
    try {
      setLoading(true);

      //Chama a função de Cadastro do contexto:
      await signUp(data);
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Erro with singUp:", error);
    }
  }

  // Verifica se existem erros e exibe toast
  const onError = (error: any ) => {
    if (error.name) {
      toast.warn(error.name.message);
    }
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
        <title>TaskList - Cadastro</title>
      </Head>
      <div className={styles.container}>
        <Logo/>
        <div className={styles.login}>
          <h1>Cadastro</h1>
          <form onSubmit={handleSubmit(handleSignUp, onError)}>
            <Input
              placeholder="Digite seu Nome..."
              type="text"
              {...register("name")}
              id="name"
            />
            {errors.name && <p className={styles.error} >{errors.name.message}</p>}
            <Input
              placeholder="Digite seu Email..."
              type="text"
              {...register("email")}
              id="email"
            />
            {errors.email && <p className={styles.error} >{errors.email.message}</p>}
            <Input
              placeholder="Digite sua Senha..."
              type="password"
              {...register("password")}
              id='password'
            />
            {errors.password && <p className={styles.error} >{errors.password.message}</p>}

            <Button
              type="submit"
              loading={loading}
            >
              Criar Conta
            </Button>
          </form>
          <Link href="/" className={styles.text}>
            <span >Já tem uma conta? faça login</span>
          </Link>
        </div>
      </div>
    </>
  );
}
