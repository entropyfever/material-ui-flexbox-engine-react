import Grid from '@mui/material/Grid';
import React from 'react';

const LayoutContainer = (
  {
    isLeaf,
    styles,
    children,
  },
) => {
  return (
    <Grid
      container
      item={ !!isLeaf }
      sx={ {
        ...styles,
      } }
    >
      {children}
    </Grid>
  );
};

export default LayoutContainer;
