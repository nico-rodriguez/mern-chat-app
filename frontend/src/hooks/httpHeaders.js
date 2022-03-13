import { ChatState } from '../context/ChatProvider';

export const useHeaders = () => {
  const { user } = ChatState();

  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
};
