import { useEffect } from 'react';
import socketIO from 'socket.io-client';
import { Navbar } from './components/index.js';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Home, Room } from './pages/index.js';
import DefaultLayout from './layout/default.jsx';
import RoomLayout from './layout/roomLayout.jsx';

const webSocket = process.env.REACT_APP_WEBSOCKET_URL;

const App = () => {
  // useEffect(() => {
  //   socketIO(webSocket);
  // }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index exact element={<Home />} />
            <Route path="/home" element={<Home />} />
          </Route>

          <Route path="/room/" element={<RoomLayout />}>
            <Route path=":roomId" element={<Room />} />
            <Route path="" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
