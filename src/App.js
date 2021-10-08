import React from 'react';
import { Container } from '@mui/material';
import Builder from './components/layouts/BuilderLayout';
import { SortableTree } from './components/tree/SortableTree';
import { TreeProvider } from './hooks-providers/tree-provider';
import TreeRenderer from './components/atoms/TreeRenderer';
import StylingToolset from './components/toolsets/StylingToolset';

const App = () => {
  return (
    <TreeProvider>
      <Builder
        content={ () => {
          return (
            <Container>
              <TreeRenderer />
            </Container>
          );
        } }
        rightDrawerProps={
          {
            content: () => {
              return (
                <SortableTree collapsible indicator removable />
              );
            },
          }
        }
        leftDrawerProps={
          {
            content: () => {
              return <StylingToolset />;
            },
          }
        }
      />
    </TreeProvider>
  );
};

export default App;
