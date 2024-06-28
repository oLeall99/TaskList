import { useContext } from 'react';
import Link from 'next/link';

import styles from './styles.module.scss'

import { RiLoginBoxLine } from "react-icons/ri";
import { MiniLogo } from "@/components/logo";

import { AuthContext } from '@/context/authContext';

export function Header(){
    const { signOut } = useContext(AuthContext)

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href='/dashboard'>
                    <MiniLogo/>
                </Link>

                <nav className={styles.headerNav}>
                    <Link href='/task'>
                        <span>New Task</span>
                    </Link>
                    <Link href='/config'>
                        <span>Settings</span>
                    </Link>

                    <button onClick={signOut}>
                        <RiLoginBoxLine color='#fff' size={24}/>
                    </button>
                </nav>
            </div>
        </header>
    )
}