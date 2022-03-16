import { ChatState } from '../context/ChatProvider';

export const useSender = () => {
  const { user, selectedChat } = ChatState();
  const users = selectedChat?.users;

  const getSender = users => {
    return users?.[0]._id === user._id ? users?.[1] : users?.[0];
  };

  const isSameSenderMargin = (messages, m, i) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== user._id
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== user._id) ||
      (i === messages.length - 1 && messages[i].sender._id !== user._id)
    )
      return 0;
    else return 'auto';
  };

  const isSameSender = (messages, m, i) => {
    return (
      i < messages.length - 1 &&
      (messages?.[i + 1].sender._id !== m.sender._id ||
        messages?.[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== user._id
    );
  };

  const isLastMessage = (messages, i) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== user._id &&
      messages[messages.length - 1].sender._id
    );
  };

  const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };

  return {
    sender: users?.[0]._id === user._id ? users?.[1] : users?.[0],
    getSender,
    isSameSenderMargin,
    isSameSender,
    isLastMessage,
    isSameUser,
  };
};
