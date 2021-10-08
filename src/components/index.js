import React from 'react';
import { MainProvider } from '../hooks-providers/main-provider';
import Main from './Main';

const Engine = () => {
  return (
    <MainProvider>
      <Main />
    </MainProvider>
  );
};

export default Engine;
