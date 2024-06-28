import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Modal from 'react-modal'

// Componentes do Next
import Head from "next/head";

// Estilo
import styles from "./styles.module.scss";

// Server Side
import { canSSRAuth } from "@/utils/canSSRAuth";

// Componentes
import { Header } from "@/components/Header";
import { Input } from "@/components/input";
import { EditModal } from "@/components/EditModal"

// Icon
import { RiUser3Line } from "react-icons/ri";
import { RiMailLine } from "react-icons/ri";

import { AuthContext, UserProps } from "@/context/authContext";
import { PasswordModal } from "@/components/PasswordModal";
import { UserModal } from "@/components/UserModal";

export default function Config() {
    const { user, signOut, fetchUserData } = useContext(AuthContext);

    const [modalItem, setModalItem] = useState<UserProps>(); 
    const [modalPasswordVisible, setModalPasswordVisible] = useState<boolean>(false); 
    const [modalChangeVisible, setModalChangeVisible] = useState<boolean>(false); 

    useEffect(() => {
        setModalItem(user); // Atualiza o modalItem quando o usuário mudar
    }, [user]);

    function handleCloseModalPassword(){
        setModalPasswordVisible(false);
    }

    async function handleOpenModalView(){
        setModalItem(user);
        setModalPasswordVisible(true);
    }

    async function handleCloseModalUser(){
        await fetchUserData();
        setModalChangeVisible(false);
    }

    async function handleOpenModalUserView(){
        setModalItem(user);
        setModalChangeVisible(true);
    }

    Modal.setAppElement('#__next')

    return (
      <>
        <Head>
          <title>TaskList - Home</title>
        </Head>
          <Header/>
          <main className={styles.container}>
              <div className={styles.perfil}>
                  <RiUser3Line size={200} className={styles.user}/>
                  <h1>{user?.name}</h1>
                  <strong> <RiMailLine size={20} color="#fff"/>{user?.email} </strong>

                  <button type="button" className={styles.editButtons} onClick={handleOpenModalView}>Alterar Senha</button>
                  <button type="button" className={styles.editButtons} onClick={handleOpenModalUserView}>Atualizar Perfil</button>
                  <button type="button" className={styles.exitButton} onClick={signOut}>Sair</button>
              </div>
          </main>
        { modalPasswordVisible && (
            <PasswordModal
               isOpen={modalPasswordVisible}
               onRequestClose={handleCloseModalPassword}
               user={modalItem}
            />
        )}
        { modalChangeVisible && (
            <UserModal
               isOpen={modalChangeVisible}
               onRequestClose={handleCloseModalUser}
               user={modalItem}
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
