import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => {
  return {
    root: {
      minWidth: '50px',
      minHeight: '50px',
      border: '1px solid red',
      borderRadius: '2px',
    },
  };
});

const Item = (
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
      item
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

Item.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

Item.defaultProps = {
  className: null,
  style: {},
};

export default Item;
