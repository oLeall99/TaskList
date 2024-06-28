import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from './styles.module.scss';

import { Input, TextArea } from "../input";
import { Button } from '../button';
import { api } from '@/services/apiClient';
import { toast } from 'react-toastify';

import { RiCloseFill } from "react-icons/ri";

import { TaskProps } from '@/pages/dashboard';

import { schemaEditTask, FormEditTaskData } from "@/utils/schemas";

interface ModalTaskProps {
  isOpen: boolean;
  task: TaskProps | undefined;
  onRequestClose: () => void;
}

export function EditModal({ isOpen, task, onRequestClose }: ModalTaskProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormEditTaskData>({
        resolver: zodResolver(schemaEditTask),
        defaultValues: {
            title: task?.title || '',
            desc: task?.desc || '',
            status: task?.status || 0,
        }
    });

    useEffect(() => {
      if (task) {
        reset({
            title: task.title,
            desc: task.desc,
            status: task.status,
          });
      }
    }, [task, reset]);

    async function handleUpdateTask(data: FormEditTaskData){
        if(!task) return
  
        try {
          // Conversão explícita do status para número
          const updatedData = {
            ...data,
            status: Number(data.status),
          };

          console.log(updatedData)
  
          const response = await api.put(`/tasks/${task.id}`, updatedData);
  
          if (response.status === 200) {
            toast.success('Tarefa atualizada com sucesso');
            onRequestClose();
          }
        } catch (error) {
          toast.error('Erro ao atualizar tarefa');
        }
    };

    // Verifica se existem erros e exibe toast
    const onError = (error: any ) => {
        if (error.title) {
          toast.warn(error.title.message);
        }
        if (error.desc) {
          toast.warn(error.desc.message);
        }
        if (error.status) {
          toast.warn(error.status.message);
        }
    };

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          padding: '30px',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#1d1d2e',
          border: 'none',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
    };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={customStyles}
      >
        <button
          type='button'
          onClick={onRequestClose}
          className={styles.modalCloseButton}
          style={{ background: 'transparent', border: 0 }}
        >
          <RiCloseFill color='#fff' size={20} />
        </button>

        <div className={styles.container}>
          <h2>Atualizar Tarefa</h2>
          <hr/>
          <form onSubmit={handleSubmit(handleUpdateTask, onError)}>
              <div className={styles.topForm}>
                  <select id='status' {...register('status', { valueAsNumber: true })}>
                    <option value={0}>Pendente</option>
                    <option value={1}>Em andamento</option>
                    <option value={2}>Concluído</option>
                  </select>
                  <Input
                    {...register('title')}
                    id='title'
                    placeholder="Título"
                  />
              </div>
            <TextArea
              {...register('desc')}
              id='desc'
              placeholder="Descrição"
            />
            <Button type='submit'>Atualizar Tarefa</Button>
          </form>
        </div>
      </Modal>
    );
}   
