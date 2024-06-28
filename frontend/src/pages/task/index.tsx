import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form' 
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

// Component do Next
import Head from "next/head";
import Link from "next/link";

// Estilo
import styles from "./styles.module.scss";

// Componentes
import { Input, TextArea } from "@/components/input";
import { Button } from "@/components/button";
import { Header } from '@/components/Header';

// Schema
import { FormNewTaskData, schemaNewTask } from '@/utils/schemas';

// Importe da API
import { api } from '@/services/apiClient';

export default function SignUp() {
  
  // Validação de Schema:
  const { register, handleSubmit,  formState: { errors } } = useForm<FormNewTaskData>({
    resolver: zodResolver(schemaNewTask)})


  const [loading, setLoading] = useState(false)

  // Função de Cadastro:
  async function handleCreateTask(data: FormNewTaskData) {
    try{

        const response = await api.post('/tasks', data)

        toast.success("Tarefa Criada com sucesso!")
        
    }catch(err){
        const apiError = err as AxiosError
        if (apiError.response && apiError.response.status === 400) {
            toast.error("Erro na validação.")
        } else {
            toast.error("Erro ao criar tarefa.");
        }
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
      <Header/>
      <div className={styles.container}>
        <div className={styles.task}>
          <h1>Criar Nova Tarefa</h1>
          <form onSubmit={handleSubmit(handleCreateTask, onError)}>
            <Input
              placeholder="Digite o título..."
              type="text"
              {...register("title")}
              id="title"
            />
            {errors.title && <p className={styles.error} >{errors.title.message}</p>}
            <TextArea
                placeholder="Descrição..."
                {...register("desc")}
                id="desc"
            />
            {errors.desc && <p className={styles.error} >{errors.desc.message}</p>}
            <Button
              type="submit"
              loading={loading}
            >
              Criar Tarefa
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
