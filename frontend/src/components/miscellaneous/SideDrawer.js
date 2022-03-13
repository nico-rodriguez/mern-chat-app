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
import {
  ArrowForwardIcon,
  BellIcon,
  ChevronDownIcon,
  DragHandleIcon,
} from '@chakra-ui/icons';
import { useState } from 'react';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import UsersLoading from '../UsersLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { ChatState } from '../../context/ChatProvider';
import { useHeaders } from '../../hooks/httpHeaders';
import { useCustomToast } from '../../hooks/toast';

const SideDrawer = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useCustomToast();

  const history = useHistory();

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const headers = useHeaders();

  const logoutHandler = () => {
    localStorage.removeItem('user');
    history.push('/');
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
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
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