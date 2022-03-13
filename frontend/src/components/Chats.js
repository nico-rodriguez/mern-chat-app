import axios from 'axios';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { AddIcon } from '@chakra-ui/icons';
import Loading from './UsersLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { useHeaders } from '../hooks/httpHeaders';
import { useCustomToast } from '../hooks/toast';

const Chats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const headers = useHeaders();

  const toast = useCustomToast();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('/api/chats', headers);
      setChats(data);
    } catch (error) {
      toast('Error occurred!', 'error', 'bottom-left', 'Failed to load chats');
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
                    ? chat.users.filter(({ _id }) => _id !== user._id)[0].name
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
