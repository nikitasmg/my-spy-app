import React, {FC, ReactElement} from 'react'
import styles from './MyModal.module.scss'
import cn from "classnames";
interface ModalProps {
    visible: boolean
    title?: string
    content: ReactElement | string
    footer?: ReactElement | string
    onClose: () => void
}

export const MyModal: FC<ModalProps> = ({visible = false,
                                            title = '',
                                            content = '',
                                            footer = '',
                                            onClose, }) => {

    const onKeydown = ({ key }: KeyboardEvent) => {
        switch (key) {
            case 'Escape':
                onClose()
                break
        }
    }
    React.useEffect(() => {
        document.addEventListener('keydown', onKeydown)
        return () => document.removeEventListener('keydown', onKeydown)
    })
    if (!visible) return null
    return (
        <div className={styles.wrapper} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <span className={styles.close} onClick={onClose}>
            &times;
          </span>
                </div>
                <div className={styles.body}>
                    <div className={styles.content}>{content}</div>
                </div>
                {footer && <div className={styles.footer}>{footer}</div>}
            </div>
        </div>
    )
}
