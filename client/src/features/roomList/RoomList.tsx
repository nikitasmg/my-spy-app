import React, {FC, ReactElement, useEffect, useState} from 'react';
import {MyButton} from '../myButton/MyButton';
import {RoomItem} from '../roomItem/RoomItem';
import {MyModal} from '../MyModal/MyModal';
import styles from './RoomList.module.scss';
import {Myinput} from '../myInput/Myinput';
import {Room} from "../../models/Room";
import {useMutation, useQuery, useSubscription} from "@apollo/client";
import {GET_ALL_ROOMS} from "../../services/query/getAllRooms";
import {CREATE_ROOM} from "../../services/mutations/createRoom";
import {Player} from "../../models/Player";
import {ROOM_SUBSCRIPTION} from "../../services/subscription/roomSub";

interface RoomListData {
    rooms:Room[]
}
interface InputRoom {
    title: string,
    createdBy:string,
    players?: Player[]
}

export const RoomList: FC = () => {
    const [roomName, setRoomName] = useState('')
    const [username, setUsername] = useState('')
    const [roomModal, setRoomModal] = useState(false)
    const [usernameModal, setUsernameModal] = useState(false)
    const [roomList, setRoomList] = useState<Room[]>([])

    const { data:subData, loading:subLoading } = useSubscription(
        ROOM_SUBSCRIPTION,
        {
            onSubscriptionData: (data) => {
                const room = data.subscriptionData.data.roomCreated
                console.log(data.subscriptionData.data.roomCreated)
                setRoomList(prevState => [...prevState, room])
                console.log('message received')
            }
        });
    const {data,error,loading} = useQuery<RoomListData>(GET_ALL_ROOMS)
    const {subscribeToMore, ...result} = useQuery(GET_ALL_ROOMS);


    const  [newRoom, {error:roomError,data:roomData}] = useMutation<{title:string},{input:InputRoom}>(CREATE_ROOM)

    const addNewRoom = (e:React.FormEvent<HTMLElement>) => {
        e.preventDefault()
        newRoom({
            variables: {
                input: {
                    title:roomName,
                    createdBy:'Nikita',
                }
            },
        }).then(data => {
            console.log('отправилось')
        })
        handleCloseRoomModal()
    }

    useEffect(() => {
        if(data) {
            const rooms = data.rooms
            setRoomList(rooms)
        }
    }, [data])

    const handleChangeRoomName = (e: React.FormEvent<HTMLInputElement>) => {
        setRoomName(e.currentTarget.value)
    }
    const handleChangeUsername = (e: React.FormEvent<HTMLInputElement>) => {
        setUsername(e.currentTarget.value)
    }

    const handleCloseRoomModal = () => {
        setRoomModal(false)
        setRoomName('')
    }
    const handleCloseUsernameModal = () => {
        setUsernameModal(false)
        setUsername('')
    }
    const modalRoomContent = (): React.ReactElement => {
        return (
            <form className={styles.modal_wrapper} onSubmit={addNewRoom}>
                <label htmlFor={'roomName'} className={styles.label}>
                    Введите название комнаты
                </label>
                <Myinput id={'roomName'} type='text' value={roomName} onChange={handleChangeRoomName}
                         placeholder={'Моя комната...'}/>
                <MyButton size={'s'} type='submit'>Создать</MyButton>
            </form>
        )
    }

    const modalUserContent = (): ReactElement => {
        return (
            <div className={styles.modal_wrapper}>
                <label htmlFor={'userName'} className={styles.label}>
                    Введите имя
                </label>
                <Myinput id={'userName'} type='text' value={username} onChange={handleChangeUsername}
                         placeholder={'Василий ака Шпион...'}/>
                <MyButton type={'button'} size={'l'}>Войти в комнату</MyButton>
            </div>
        )
    }
    return (
        <div className={styles.wrapper}>
            <ul className={styles.list}>
                {loading ? <h2>Loading...</h2>
                    : data && roomList.map((room:Room) => {
                    return (
                        <RoomItem
                            onClick={() => setUsernameModal(true)}
                            key={room.id}
                            id={room.id}
                            title={room.title}
                            createdBy={room.createdBy}
                            players={room.players}
                        />
                    );
                })}
            </ul>
            <div className={styles.btn_container}>
                <MyButton type={'button'} size={'xl'} onClick={() => setRoomModal(true)}>Создать комнату</MyButton>
                <MyButton type={'button'} size={'xl'}>Добавить локацию</MyButton>
            </div>
            <MyModal visible={roomModal} title={'Создание комнаты'} content={modalRoomContent()}
                     onClose={handleCloseRoomModal}>
            </MyModal>
            <MyModal visible={usernameModal} title={'Присоедениться к комнате'} content={
                modalUserContent()} onClose={handleCloseUsernameModal}>
            </MyModal>
        </div>
    );
};
