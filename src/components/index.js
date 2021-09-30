import React from 'react';
import { MainProvider } from '../hooks-providers/main-provider';
import Main from './Main';
import Toolset from './Toolset';

const Engine = () => {
  return (
    <MainProvider>
      <Main />
      <Toolset />
    </MainProvider>
  );
};

export default Engine;
