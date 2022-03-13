import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useCustomToast } from './toast';

export const useSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(true);
  const [picture, setPicture] = useState('');
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const toast = useCustomToast();

  const uploadPicture = pictures => {
    setLoading(true);
    if (pictures === undefined) {
      toast('Select an image', 'warning', 'bottom');
    }

    if (pictures.type === 'image/jpeg' || pictures.type === 'image/png') {
      const data = new FormData();
      data.append('file', pictures);
      data.append('upload_preset', 'Talk-A-Tive');
      data.append('cloud_name', 'dnjnlemli');
      fetch('https://api.cloudinary.com/v1_1/dnjnlemli/image/upload', {
        method: 'POST',
        body: data,
      })
        .then(res => res.json())
        .then(data => {
          setPicture(data.url.toString());
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    } else {
      toast('Select an image', 'warning', 'bottom');
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast('Fill all the fields', 'warning', 'bottom');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match', 'warning', 'bottom');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/users',
        { name, email, password, picture },
        config
      );

      toast('Registration successful!', 'success', 'bottom');
      localStorage.setItem('user', JSON.stringify(data));
      setLoading(false);
      history.push('/chats');
    } catch ({ message }) {
      toast('Error occurred!', 'error', 'bottom', message);
      setLoading(false);
    }
  };

  return {
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    loading,
    uploadPicture,
    handleSubmit,
  };
};
