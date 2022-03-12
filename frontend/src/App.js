import { Route } from 'react-router-dom';

import Chat from './pages/Chat';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <div className="app">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={Chat} />
    </div>
  );
}

export default App;
