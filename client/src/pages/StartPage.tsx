import { Link } from "react-router-dom";
import {FC} from 'react'
import { RoomList } from "../features/roomList/RoomList";

export const StartPage:FC = () =>  {
    return (
      <div style={{padding:"20px 0"}}>
        <h1 style={{textAlign:'center'}}>Игра найди шпиона</h1>
        <RoomList/>
      </div>
    );
  }
  
  export default StartPage;
  