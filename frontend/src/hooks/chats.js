import { ChatState } from '../context/ChatProvider';

export const useSender = users => {
  const { user } = ChatState();

  if (!users) return;

  return users[0]._id === user._id ? users?.[1] : users?.[0];
};
