import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { useHeaders } from '../../hooks/httpHeaders';
import { useCustomToast } from '../../hooks/toast';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chats, setChats } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const headers = useHeaders();

  const toast = useCustomToast();

  const handleSearch = async query => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/users?search=${query}`, headers);
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      toast('Error occurred!', 'error', 'bottom-left', 'Failed to fetch users');
    }
  };

  const handleGroup = user => () => {
    if (selectedUsers.includes(user)) {
      toast('User already added', 'warning', 'top');
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };

  const handleDelete = user => () => {
    setSelectedUsers(selectedUsers.filter(({ _id }) => _id === user._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast('Fill all the fields', 'warning', 'top');
      return;
    }

    try {
      const { data } = await axios.post(
        '/api/chats/new-group',
        {
          name: groupChatName,
          users: selectedUsers.map(({ _id }) => _id),
        },
        headers
      );

      setChats([data, ...chats]);
      onClose();
      toast('New group chat created!', 'success', 'bottom');
    } catch ({ message }) {
      toast('Failed to create the chat group', 'error', 'bottom', message);
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            d="flex"
            fontSize="35px"
            fontFamily="Work sans"
            justifyContent="center"
          >
            Create group chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat name..."
                mb={3}
                onChange={e => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add users. e.g.: John, Jane..."
                mb={1}
                onChange={e => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map(user => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handler={handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResults
                .slice(0, 4)
                .map(user => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handler={handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
