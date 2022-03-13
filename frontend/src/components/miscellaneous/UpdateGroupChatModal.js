import { ViewIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { useHeaders } from '../../hooks/httpHeaders';
import { useCustomToast } from '../../hooks/toast';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useCustomToast();

  const headers = useHeaders();

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        '/api/chats/rename',
        {
          chatId: selectedChat._id,
          name: groupChatName,
        },
        headers
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch ({ message }) {
      toast('Error occurred!', 'error', 'bottom', message);
      setRenameLoading(false);
    }
    setGroupChatName('');
  };

  const handleAddUser = userAdd => async () => {
    if (selectedChat.users.find(({ _id }) => _id === userAdd._id)) {
      toast('User already in the group', 'error', 'bottom');
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast('Only the admin may add someone', 'error', 'bottom');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        '/api/chats/groupadd',
        {
          chatId: selectedChat._id,
          userId: userAdd._id,
        },
        headers
      );
      setSelectedChat(data);
      setFetchAgain(fetchAgain);
      setLoading(false);
    } catch ({ message }) {
      toast('Error occurred!', 'error', 'bottom', message);
      setLoading(false);
    }
  };

  const handleRemove = userRemove => async () => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userRemove._id !== user._id
    ) {
      toast('Only the admin can remove someone', 'error', 'bottom');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(
        '/api/chats/groupremove',
        {
          chatId: selectedChat._id,
          userId: userRemove._id,
        },
        headers
      );
      userRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch ({ message }) {
      toast('Error occurred!', 'error', 'bottom', message);
      setLoading(false);
    }
  };

  const handleSearch = async query => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${query}`, config);
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error occurred!',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <IconButton d={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map(user => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handler={handleRemove(user)}
                />
              ))}
            </Box>

            <FormControl d="flex">
              <Input
                placeholder="Chat name"
                mb={3}
                value={groupChatName}
                onChange={e => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add user to group"
                mb={1}
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResults.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handler={handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleRemove(user)} colorScheme="red">
              Leave group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
