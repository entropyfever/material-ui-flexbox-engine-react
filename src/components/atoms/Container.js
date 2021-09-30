import React from 'react';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import {
  GridDirectionOptions,
  GridItemsAlignmentOptions,
  GridJustificationOptions,
  GridSpacingOptions,
  GridWrapOptions,
} from '../flexbox/GridOptions';

const useStyles = makeStyles(() => {
  return {
    root: {
      minWidth: '100px',
      minHeight: '100px',
      border: '1px solid blue',
      borderRadius: '12px',
    },
  };
});

const C = (
  {
    children,
    className,
    style,
    ...rest
  },
) => {
  const classes = useStyles();
  return (
    <Grid
      container
      item // every container is also an item, except from the root container
      className={ clsx(classes.root, className) }
      style={ {
        ...style,
      } }
      { ...rest }
    >
      {children}
    </Grid>
  );
};

C.propTypes = {
  spacing: PropTypes.oneOf(GridSpacingOptions),
  className: PropTypes.string,
  style: PropTypes.object,
  direction: PropTypes.oneOf(GridDirectionOptions),
  alignItems: PropTypes.oneOf(GridItemsAlignmentOptions),
  // alignContent: PropTypes.oneOf(GridContentAlignmentOptions),
  justifyContent: PropTypes.oneOf(GridJustificationOptions),
  wrap: PropTypes.oneOf(GridWrapOptions),
};

C.defaultProps = {
  spacing: GridSpacingOptions[0],
  className: null,
  style: {},
  direction: GridDirectionOptions[0],
  alignItems: GridItemsAlignmentOptions[0],
  // alignContent: GridContentAlignmentOptions[0],
  justifyContent: GridJustificationOptions[0],
  wrap: GridWrapOptions[0],
};

export default C;
