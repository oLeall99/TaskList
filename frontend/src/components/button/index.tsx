import { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './styles.module.scss'
import { RiLoader3Fill } from 'react-icons/ri'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean,
    children: ReactNode,
}

export function Button({ loading, children, ...rest }: ButtonProps) {
    return (
        <button
            className={styles.button}
            disabled={loading}
            {...rest}
        >
            {loading ? (
                <RiLoader3Fill color="#fff" size={16} />
            ) : (
                <span className={styles.buttonText}>
                    {children}
                </span>
            )}
        </button>
    )
}
