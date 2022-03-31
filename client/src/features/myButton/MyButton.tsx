import React, {
    FC,
    HTMLAttributes
} from 'react';
import cn from 'classnames';
import styles from './MyButton.module.scss';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    size?: 'xl' | 'l' | 's',
    type:'button' | 'submit' | 'reset' | undefined
}

export const MyButton: FC<ButtonProps> = ({
                                              children,
                                              onClick, size,type
                                          }) => {
    const classNames = {
        [styles.big]: size === 'xl',
        [styles.medium]: size === 'l',
        [styles.small]: size === 's',
    }
    return (
        <button type={type} className={cn(styles.button, classNames)} onClick={onClick}>
            {children}
        </button>
    );
};
