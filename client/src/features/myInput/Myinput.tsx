import React, {FC} from 'react'
import styles from './MyInput.module.scss'

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
    type: string,
    value: string,
}

export const Myinput: FC<InputProps> = ({
                                            type,
                                            value,
                                            onChange,
                                            placeholder,
                                            id
                                        }) => {
    return (
        <input className={styles.input}
               id={id}
               type={type}
               value={value}
               onChange={onChange}
               placeholder={placeholder}/>
    )
}
