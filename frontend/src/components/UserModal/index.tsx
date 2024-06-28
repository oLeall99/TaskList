import { useEffect } from 'react';
import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { AxiosError } from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import styles from './styles.module.scss';

import { Input } from "../input";
import { Button } from '../button';
import { api } from '@/services/apiClient';
import { toast } from 'react-toastify';

import { RiCloseFill } from "react-icons/ri";

import { UserProps } from '@/context/authContext';

import { schemaUserChange, FormUserChangeData} from "@/utils/schemas";

interface ModalTaskProps {
  isOpen: boolean;
  user: UserProps | undefined;
  onRequestClose: () => void;
}

export function UserModal({ isOpen, user, onRequestClose }: ModalTaskProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormUserChangeData>({
        resolver: zodResolver(schemaUserChange),
        defaultValues: {
            name: user?.name,
            email: user?.email,
        }
    });

    useEffect(() => {
        if (user) {
          reset({
                name: user.name,
                email: user.email
            });
        }
      }, [user, reset]);

    // Função de atualizar senha do usuário
    async function handleUpdateUser(data: FormUserChangeData) {
        if (!user) return;
    
        try {
            console.log("chegou", data)
            const response = await api.put('/user', {
                name: data.name,
                email: data.email,
            });
            console.log("passou")

    
            if (response.status === 200) {
                toast.success("Dados alterados com sucesso!");
                onRequestClose();
            }
        } catch (error) {
            // Mostra um toast com o erro capturado
            const apiError = error as AxiosError
            if (apiError.response && apiError.response.status === 400) {
              toast.warn("Validação Inválida.")
            } else {
              toast.error("Erro ao atualizar usuário")
            }
        }
    }

    // Verifica se existem erros e exibe toast
    const onError = (errors: any) => {
        if (errors.name) {
            toast.warn(errors.name.message);
        }
        if (errors.email) {
            toast.warn(errors.email.message);
        }
    };

    // Estilo do modal
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
                <h2>Atualizar Conta</h2>
                <hr />
                <form onSubmit={handleSubmit(handleUpdateUser, onError)}>
                    <Input
                        type='text'
                        {...register('name')}
                        id='name'
                        placeholder="Atualizar seu nome"
                    />

                    <Input
                        type='text'
                        {...register('email')}
                        id='email'
                        placeholder="Atualizar seu email"
                    />
                    
                    <Button type='submit'>Atualizar Usuário</Button>
                </form>
            </div>
        </Modal>
    );
}
