import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import ChatProvider from './Context/ChatProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChatProvider>
    <ThemeProvider theme={theme}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ThemeProvider>
    </ChatProvider>
  </BrowserRouter>
  
);

