import { Box } from '@chakra-ui/react';
import ChatBox from '../components/ChatBox';
import Chats from '../components/Chats';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { ChatState } from '../context/ChatProvider';

export default function Chat() {
  const { user } = ChatState();

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <Chats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}
