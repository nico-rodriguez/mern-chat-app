import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ENDPOINT } from '../config/constants';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [socket, setSocket] = useState();

  const history = useHistory();

  const clearState = () => {
    setUser(null);
    setSelectedChat(null);
    setChats([]);
    setNotification([]);
    setSocket(null);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    setUser(userInfo);

    if (!socket) {
      setSocket(io(ENDPOINT));
    }

    if (!userInfo) history.push('/');
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        socket,
        setSocket,
        clearState,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
