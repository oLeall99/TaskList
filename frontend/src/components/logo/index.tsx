import styles from './styles.module.scss';

export function Logo() {
    return (
        <>
            <h1 className={styles.title}>
                <span className={styles.purple}>Task</span>
                <span className={styles.white}>List</span>
            </h1>
        </>
    );
}

export function MiniLogo(){
    return (
        <>
            <h1 className={styles.miniTitle}>
                <span className={styles.purple}>Task</span>
                <span className={styles.white}>List</span>
            </h1>
        </>
    );
}