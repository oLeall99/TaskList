import Modal from 'react-modal';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from './styles.module.scss';

import { Input } from "../input";
import { Button } from '../button';
import { api } from '@/services/apiClient';
import { toast } from 'react-toastify';

import { RiCloseFill } from "react-icons/ri";

import { UserProps } from '@/context/authContext';

import { schemaPaswordChange, FormPasswordChangeData} from "@/utils/schemas";

interface ModalTaskProps {
  isOpen: boolean;
  user: UserProps | undefined;
  onRequestClose: () => void;
}

export function PasswordModal({ isOpen, user, onRequestClose }: ModalTaskProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormPasswordChangeData>({
        resolver: zodResolver( schemaPaswordChange),
    });


    async function handleUpdatePassword(data: FormPasswordChangeData) {
        if (!user) return;
    
        try {
          const response = await api.put('/user', {
            name: user.name,
            email: user.email,
            oldPassword: data.oldPassword,
            password: data.password,
            confirmPassword: data.confirmPassword,
        });
    
          if (response.status === 200) {
            toast.success("Senha alterada com sucesso!");
            onRequestClose();
          }
        } catch (error) {
          toast.error('Erro ao atualizar a senha');
        }
    }

    // Verifica se existem erros e exibe toast
    const onError = (error: any ) => {
        if (error.password) {
          toast.warn(error.password.message);
        }
        if (error.oldPassword) {
          toast.warn(error.oldPassword.message);
        }
        if (error.confirmPassword) {
          toast.warn(error.confirmPassword.message);
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
          <h2>Atualizar Senha</h2>
          <hr/>
          <form onSubmit={handleSubmit(handleUpdatePassword, onError)}>
            <Input
                type='password'
                {...register('oldPassword')}
                id='oldPassword'
                placeholder="Digite sua senha atual..."
            />

            <Input
                type='password'
                {...register('password')}
                id='password'
                placeholder="Digite sua nova senha..."
            />

            <Input
                type='password'
                {...register('confirmPassword')}
                id='confirmPassword'
                placeholder="Confirme sua nova senha..."
            />
            
            <Button type='submit'>Atualizar Senha</Button>
          </form>
        </div>
      </Modal>
    );
}   
