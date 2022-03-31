import {FC} from 'react'
import styles from './RoomItem.module.scss'
import {Room} from "../../models/Room";

interface RoomItemProps extends Room {
    onClick: () => void
}

export const RoomItem:FC<RoomItemProps> = ({title,players,onClick,createdBy}) => {
  return (
    <li className={styles.row} onClick={onClick}>
        <h2 className={styles.title}> {title} </h2>
        <span className={styles.count}>Игроков: {players.length} Создатель: {createdBy}</span>
    </li>
  )
}
