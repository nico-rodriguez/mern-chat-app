import axios from 'axios';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { AddIcon } from '@chakra-ui/icons';
import Loading from './UsersLoading';
import { getSender } from '../config/Chat';
import GroupChatModal from './miscellaneous/GroupChatModal';

const Chats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('/api/chats', config);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error occurred!',
        description: 'Failed to load chats',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('user')));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New group chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#f8f8f8"
        w="100%"
        h="100%"
        borderRadius="lg"
      >
        {chats ? (
          <Stack>
            {chats.map(chat => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? '#38b2ac' : '#e8e8e8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroup
                    ? getSender(loggedUser, chat.users)
                    : chat.name}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <Loading />
        )}
      </Box>
    </Box>
  );
};

export default Chats;
