import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import { useState } from 'react';
import { useLogin } from '../../hooks/login';

export const Login = () => {
  const [show, setShow] = useState(false);

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleSubmit,
    setDefaultCredentials,
  } = useLogin();

  return (
    <VStack spacing="5px" color="black">
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Email..."
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Password..."
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        onClick={handleSubmit}
        style={{ marginTop: 15 }}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={setDefaultCredentials}
        style={{ marginTop: 15 }}
        isLoading={loading}
      >
        Guest user
      </Button>
    </VStack>
  );
};
