import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Modal from 'react-modal'

// Componentes do Next
import Head from "next/head";
import Link from "next/link";

// Estilo
import styles from "./styles.module.scss";

// Server Side
import { canSSRAuth } from "@/utils/canSSRAuth";

// Componentes
import { Header } from "@/components/Header";
import { Input } from "@/components/input";
import { EditModal } from "@/components/EditModal"

// Icon
import { RiEditBoxLine } from "react-icons/ri";
import { RiDeleteBin2Line } from "react-icons/ri";
import { RiSearch2Line } from "react-icons/ri";
import { RiAddLargeLine } from "react-icons/ri";

// Importe da API
import { api } from '@/services/apiClient';

//Schema
import { schemaSearch, FormSearchData } from "@/utils/schemas";
import { AxiosError } from "axios";

// Tipo para Task:
export type TaskProps = {
  id: string;
  title: string;
  desc: string;
  status: number;
  createdAt: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<TaskProps[]>([]); // Para salvar Lista de Tarefas
  const [errorMessage, setErrorMessage] = useState("");

  const [modalItem, setModalItem] = useState<TaskProps>(); // Para exibir detalhes da tarefa em um modal
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Controle de visibilidade do modal

  const { register, handleSubmit, formState: { errors } } = useForm<FormSearchData>({
    resolver: zodResolver(schemaSearch),
  });

  // Função para buscar todas as tarefas ao carregar a página
  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await api.get('/tasks');

        if (response.status === 200) {
          const formattedTasks = response.data.map((task: TaskProps) => ({
            ...task,
            createdAt: formatCreatedAt(task.createdAt), // Formata createdAt antes de definir no estado
          }));
          
          setTasks(formattedTasks);
          setErrorMessage("");
        } else if (response.status === 404) {
          setTasks([]);
          setErrorMessage("Nenhuma tarefa encontrada...");
        }
        
      } catch (error) {
        setTasks([]);
        
        const apiError = error as AxiosError
        if (apiError.response && apiError.response.status === 404) {
          setErrorMessage("Nenhuma tarefa encontrada...");
        } else {
          setErrorMessage("Erro ao buscar tarefas");
        }
      }
    }

    fetchTasks();
  }, []); // [] indica que esta função será executada apenas uma vez ao montar o componente

  // Função de Pesquisa de Tarefas
  async function handleSearch(data: FormSearchData){
    try {
      const response = await api.get('/tasks/search', {
        params: data // Passa data como parâmetros de query
      });

      if (response.status === 200) {
        const formattedTasks = response.data.map((task: TaskProps) => ({
          ...task,
          createdAt: formatCreatedAt(task.createdAt), // Formata createdAt antes de definir no estado
        }));
        
        setTasks(formattedTasks);
        setErrorMessage("");
      } else if (response.status === 404) {
        setTasks([]);
        setErrorMessage("Nenhuma tarefa encontrada...");
      }
      
    } catch (error) {
      setTasks([]);
      
      const apiError = error as AxiosError
      if (apiError.response && apiError.response.status === 404) {
        setErrorMessage("Nenhuma tarefa encontrada...");
      } else {
        setErrorMessage("Erro ao buscar tarefas");
      }
    }
  }

  // Verifica se existem erros e exibe toast
  const onError = (error: any ) => {
    if (error.search) {
      toast.warn(error.search.message);
    }
    if (error.status) {
      toast.warn(error.status.message);
    }
    if (error.time) {
      toast.warn(error.time.message);
    }
  };

  // Função para alterar o Status de uma tarefa:
  async function handleChangeStatus(taskId: string, status: number){
    try {

      // Encontrar a tarefa atual no estado local
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          // Atualizar apenas o status da tarefa desejada
          return {
            ...task,
            status: status,
          };
        }
        return task;
      });
      
      // Atualizar o estado local com as tarefas atualizadas
      setTasks(updatedTasks);
      
      // Atualiza a task no banco de dados
      api.put(`/tasks/${taskId}`, { status: status })
      .then(response => {
        console.log("Status atualizado com sucesso:", response.data);
      })
      .catch(error => {
        console.error("Erro ao atualizar o status da tarefa:", error);
      });
      toast.success("Status Atualizado")
    } catch (error) {
      // Mostra um toast com o erro capturado
      const apiError = error as AxiosError
      if (apiError.response && apiError.response.status === 404) {
        toast.warn("Tarefa não encontrada.")
      } else {
        toast.error("Erro ao atualizar status")
      }
    }
  };

  // Função para alterar o Status de uma tarefa:
  async function handleDeleteTask(taskId: string){
    try {
      // Faz a requisição DELETE para a API
      const response = await api.delete(`/tasks/${taskId}`);
  
      if (response.status === 200) {
        // Remove a tarefa excluída do estado local
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
        toast.success("Tarefa excluída com sucesso");
      } else {
        toast.error("Erro ao excluir tarefa");
      }
      
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      toast.error("Erro ao excluir tarefa");
    }    
  };


  // Função para formatar createdAt para exibir apenas dia, mês e ano
  const formatCreatedAt = (createdAt: string) => {
    const date = new Date(createdAt);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  function handleCloseModal(){
    setModalVisible(false);
  }
  
  async function handleOpenModalView(task_id: string){
    const response = await api.get('/task', { params: {task_id}})
    setModalItem(response.data);
    setModalVisible(true);

  }


  Modal.setAppElement('#__next')

  return (
    <>
      <Head>
        <title>TaskList - Home</title>
      </Head>
        <Header/>
        <main className={styles.container}>
          <div className={styles.taskContainer}>
            <form className={styles.searchContainer} onSubmit={handleSubmit(handleSearch, onError)}>
              <div className={styles.search}>
                <Input               
                  placeholder="Buscar Tarefa"
                  type="text"
                  {...register("search")}
                  id='search'
                />
                <button type="submit">
                  <RiSearch2Line  color='#fff' size={20}/>
                </button>
              </div>
              <div className={styles.options}>
                <div className={styles.filter}>
                  <span className={styles.red}>
                    <input type="checkbox" {...register("pendente")} /> Pendente
                  </span>
                  <span className={styles.yellow}>
                    <input type="checkbox" {...register("emAndamento")} /> Em andamento
                  </span>
                  <span className={styles.green}>
                    <input type="checkbox" {...register("concluido")} /> Concluído
                  </span>
                </div>
                <select id="time" {...register("time")}>
                  <option value="new">Recentes</option>
                  <option value="old">Antigas</option>
                </select>
              </div>
            </form>
            <hr/>
            <div className={styles.tasks}>
              {errorMessage ? (
                <h1>{errorMessage}</h1>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className={styles.task}>
                    <div>
                      <h2>{task.title}</h2>
                      <hr/>
                      <span>Descrição: {task.desc} </span>
                      <p>Criado em {task.createdAt}</p>
                      <p></p>
                    </div>
                    <div className={styles.taskButtons}>
                      <select
                        value={task.status}
                        onChange={(e) => handleChangeStatus(task.id, Number(e.target.value))}
                        className={styles.statusSelect}
                      >
                        <option value={0}>Pendente</option>
                        <option value={1}>Em andamento</option>
                        <option value={2}>Concluído</option>
                      </select>
                      <div className={styles.buttons}>
                        <button  type='button' className={styles.yellow} //onClick={ (e) => }
                        >
                          <RiEditBoxLine color='#fff' size={18} onClick={ (e) => handleOpenModalView(task.id)}/>
                        </button>
                        <button type='button' className={styles.red} onClick={ (e) => handleDeleteTask(task.id)}>
                          <RiDeleteBin2Line color='#fff' size={18}/>
                        </button>
                      </div>
                      <p>{task.id}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
              <Link href={'/task'} className={styles.add}><RiAddLargeLine color="#fff" size={20}/></Link>
          </div>
        </main>
        { modalVisible && (
            <EditModal
               isOpen={modalVisible}
               onRequestClose={handleCloseModal}
               task={modalItem}
            />
        )}
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return{
    props: {}
  }
})
