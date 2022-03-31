import {Player} from "./Player";

export interface Room {
    id: string;
    title: string;
    createdBy:string;
    players: Player[] | [];
}

export interface RoomListProps {
    rooms: Room[];
}