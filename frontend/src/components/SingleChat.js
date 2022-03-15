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
import { ChatState } from '../context/ChatProvider';
import { useSender } from '../hooks/chats';
import { useHeaders } from '../hooks/httpHeaders';
import { useCustomToast } from '../hooks/toast';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';

import './SingleChat.css';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const { selectedChat, setSelectedChat } = ChatState();

  const { sender } = useSender();

  const headers = useHeaders();

  const toast = useCustomToast();

  const handleTyping = event => {
    setNewMessage(event.target.value);
  };

  const sendMessage = async event => {
    if (event.key === 'Enter' && newMessage) {
      try {
        // Clear the message input before the API call for faster UX
        setNewMessage('');
        const { data } = await axios.post(
          `/api/chats/${selectedChat._id}/messages`,
          {
            content: newMessage,
          },
          headers
        );
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
  }, [selectedChat]);

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
