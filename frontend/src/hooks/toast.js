import { useToast } from '@chakra-ui/react';

export const useCustomToast = () => {
  const toast = useToast();

  return function (title, status, position, description) {
    return toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position,
    });
  };
};
