import { Avatar, Tooltip } from '@chakra-ui/react';
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../context/ChatProvider';
import { useSender } from '../hooks/chats';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const { isLastMessage, isSameUser, isSameSender, isSameSenderMargin } =
    useSender();

  console.log(messages);

  return (
    <ScrollableFeed>
      {messages &&
        user &&
        messages.map((message, index) => (
          <div style={{ display: 'flex' }} key={message._id}>
            {(isSameSender(messages, message, index) ||
              isLastMessage(messages, index)) && (
              <Tooltip
                label={message.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={message.sender.name}
                  src={message.sender.picture}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor:
                  message.sender._id === user._id ? '#bee3f8' : '#b9f5d0',
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
                marginLeft: isSameSenderMargin(messages, message, index),
                marginTop: isSameUser(messages, message, index) ? 3 : 10,
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
