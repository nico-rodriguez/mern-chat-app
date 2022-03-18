import Chat from './pages/Chat';
import Home from './pages/Home';
import './App.css';
import { ChatState } from './context/ChatProvider';

function App() {
  const { user, socket } = ChatState();

  return (
    <div className="app">
      {!(user || socket?.connected) ? <Home /> : <Chat />}
    </div>
  );
}

export default App;
