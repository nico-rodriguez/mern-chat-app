import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import ChatBox from '../components/chats/ChatBox';
import Chats from '../components/chats/Chats';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import { ChatState } from '../context/ChatProvider';

export default function Chat() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <Chats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}
