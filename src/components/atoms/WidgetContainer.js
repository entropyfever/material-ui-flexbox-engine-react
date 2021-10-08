import Grid from '@mui/material/Grid';
import React from 'react';

const WidgetContainer = (
  {
    styles,
    widget: Widget,
  },
) => {
  return (
    <Grid
      item
      sx={ {
        ...styles,
      } }
    >
      <Widget />
    </Grid>
  );
};

export default WidgetContainer;
