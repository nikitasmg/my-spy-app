import {StartPage,RoomPage} from './pages/index'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './styles/App.scss'

function App(){
  return (
    <BrowserRouter>
    <div className="app">
      <Routes>
        <Route path='/' element={<StartPage/>} />
        <Route path='/room' element={<RoomPage/>} />
      </Routes>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
