import axios from 'axios';
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import NotificationBadge, { Effect } from 'react-notification-badge';
import { useState } from 'react';
import ProfileModal from '../user/ProfileModal';
// import { useHistory } from 'react-router-dom';
import UsersLoading from '../user/UsersLoading';
import UserListItem from '../user/UserListItem';
import { ChatState } from '../../context/ChatProvider';
import { useHeaders } from '../../hooks/httpHeaders';
import { useCustomToast } from '../../hooks/toast';
import { useSender } from '../../hooks/chats';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useCustomToast();

  // const history = useHistory();

  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    socket,
    clearState,
  } = ChatState();

  const { getSender } = useSender();

  const headers = useHeaders();

  const logoutHandler = async () => {
    selectedChat && socket.emit('leave_chat', selectedChat._id);
    socket.disconnect();
    clearState();
    // history.push('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast('Enter a name or email', 'warning', 'top-left');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/users?search=${search}`, headers);
      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      toast(
        'Error ocurred!',
        'error',
        'bottom-left',
        'Failed to load search results'
      );
    }
  };

  const accessChat = async userId => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post('/api/chats', { userId }, headers);

      if (!chats.find(({ _id }) => _id === data._id))
        setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch ({ message }) {
      toast('Error fetching the chat', 'error', 'bottom-left', message);
    }
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: 'none', md: 'flex' }} px="4px">
              Search user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!(notification.length > 0)
                ? 'No new messages'
                : notification.map(notif => {
                    console.log(notif);
                    return (
                      <MenuItem
                        key={notif._id}
                        onClick={() => {
                          setSelectedChat(notif.chat);
                          setNotification(
                            notification.filter(n => n !== notif)
                          );
                        }}
                      >
                        {notif.chat.isGroup
                          ? `New message in ${notif.chat.name}`
                          : `New message from ${
                              getSender(notif.chat.users).name
                            }`}
                      </MenuItem>
                    );
                  })}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <UsersLoading />
            ) : (
              searchResult?.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handler={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
