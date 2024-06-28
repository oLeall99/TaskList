import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import styles from './styles.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return (
        <input className={styles.input} ref={ref} {...props} />
    );
});

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
    return (
        <textarea className={styles.input} ref={ref} {...props}></textarea>
    );
});
