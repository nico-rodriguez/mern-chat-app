import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCustomToast } from './toast';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const toast = useCustomToast();

  const handleSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
      toast('Fill all the fields', 'warning', 'bottom');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );

      toast('Login successful!', 'success', 'bottom');
      localStorage.setItem('user', JSON.stringify(data));
      setLoading(false);
      history.push('/chats');
    } catch ({ message }) {
      toast('Error occurred!', 'error', 'bottom', message);
      setLoading(false);
    }
  };

  const setDefaultCredentials = () => {
    setEmail('guest@example.com');
    setPassword('password');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    setLoading,
    handleSubmit,
    setDefaultCredentials,
  };
};