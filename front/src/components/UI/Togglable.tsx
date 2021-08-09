import React, { useState, useImperativeHandle } from 'react';
import { Button } from '@material-ui/core';

interface TogglableProps {
  buttonLabelOpen: string;
  buttonLabelClose: string;
  children: React.ReactNode;
}

const Togglable = React.forwardRef((props: TogglableProps, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };
  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          variant={'contained'}
          className="toggleButtonOn"
          onClick={toggleVisibility}
        >
          {props.buttonLabelOpen}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <br />
        <Button
          variant={'contained'}
          className="toggleButtonOff"
          onClick={toggleVisibility}
        >
          {props.buttonLabelClose}
        </Button>
      </div>
    </div>
  );
});

export default Togglable;
