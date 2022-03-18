import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ChatProvider from './context/ChatProvider';

ReactDOM.render(
  <StrictMode>
    <ChakraProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root')
);
