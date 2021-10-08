import React from 'react';
import TextField from '@mui/material/TextField';
import { useTree } from '../../hooks-providers/tree-provider';
import { findItemDeep, setProperty } from '../tree/utilites';

const StylingToolset = () => {
  const { items, setItems, selected } = useTree();

  const item = findItemDeep(items, selected);

  function handleStyleChange(property, value) {
    setItems((items_) => {
      return setProperty(items_, selected, 'styles', (prevStyles) => {
        return {
          ...prevStyles,
          [property]: value,
        };
      });
    });
  }

  const properties = [
    'width',
    'height',
    'justifyContent',
    'alignItems',
    'flexDirection',
  ];

  if (!item) {
    return null;
  }

  const fields = properties.map((property) => {
    return (
      <TextField
        key={ property }
        label={ property }
        variant='standard'
        value={ item.styles?.[property] || '' }
        onChange={ (e) => {
          handleStyleChange(property, e.target.value);
        } }
      />
    );
  });

  return (
    <div>
      {selected}
      {JSON.stringify(item.styles)}
      <div style={ { width: '100%' } }>
        {fields}
      </div>
    </div>
  );
};

export default StylingToolset;
