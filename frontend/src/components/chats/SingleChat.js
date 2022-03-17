import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { useSender } from '../../hooks/chats';
import { useHeaders } from '../../hooks/httpHeaders';
import { useCustomToast } from '../../hooks/toast';
import ProfileModal from '../user/ProfileModal';
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import Lottie from 'react-lottie';
import animationData from '../../animations/typing.json';

import './SingleChat.css';

let selectedChatCompare;
let timer;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    socket,
  } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { sender } = useSender();

  const headers = useHeaders();

  const toast = useCustomToast();

  const handleTyping = event => {
    setNewMessage(event.target.value);

    if (!socket?.connected) return;

    socket.emit('typing', selectedChat._id);

    clearTimeout(timer);
    timer = setTimeout(() => {
      socket.emit('stop_typing', selectedChat._id);
    }, 3000);
  };

  const sendMessage = async event => {
    if (event.key === 'Enter' && newMessage) {
      try {
        // Clear the message input before the API call for faster UX
        setNewMessage('');
        socket.emit('stop_typing', selectedChat._id);
        const { data } = await axios.post(
          `/api/chats/${selectedChat._id}/messages`,
          {
            content: newMessage,
          },
          headers
        );

        socket.emit('new_message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast('Error ocurred!', 'error', 'bottom', 'Failed to send message');
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/chats/${selectedChat._id}/messages`,
        headers
      );
      setMessages(data);
      setLoading(false);
    } catch (error) {
      toast('Error ocurred!', 'error', 'bottom', 'Failed to load messages');
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare && socket.emit('leave_chat', selectedChatCompare._id);
    selectedChat && socket.emit('join_chat', selectedChat._id);
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (socket && user) {
      socket.emit('setup', user);
      socket.on('connected', () => {});
      socket.on('typing', () => {
        setIsTyping(true);
      });
      socket.on('stop_typing', () => {
        setIsTyping(false);
      });
    }
  }, [socket, user]);

  useEffect(() => {
    if (socket) {
      socket.on('message_received', message => {
        if (
          !selectedChatCompare ||
          selectedChatCompare._id !== message.chat._id
        ) {
          if (!notification.includes(message)) {
            setNotification([message, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages([...messages, message]);
        }
      });
    }
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
          >
            <IconButton
              d={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            />
            {!selectedChat.isGroup ? (
              <>
                {sender.name}
                <ProfileModal user={sender} />
              </>
            ) : (
              <>
                {selectedChat.name}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#e8e8e8"
            w="100%"
            h="100%"
            borderRadius="lg"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData,
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid slice',
                    },
                  }}
                  height={50}
                  width={70}
                  style={{
                    marginBottom: 15,
                    marginLeft: 0,
                    borderRadius: '40%',
                  }}
                />
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#e0e0e0"
                placeholder="Enter a message..."
                onChange={handleTyping}
                value={newMessage}
              ></Input>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
