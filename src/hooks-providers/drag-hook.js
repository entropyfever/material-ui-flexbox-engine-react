import { useRef, useState } from 'react';

const useDrag = () => {
  const elementRef = useRef(null);
  const posRef = useRef({ pos1: 0, pos2: 0, pos3: 0, pos4: 0 });
  const [ dragging, setDragging ] = useState(false);

  const onMouseDownHandler = (e) => {
    e.preventDefault();
    setDragging(true);
    // get the mouse cursor position at startup:
    posRef.current.pos3 = elementRef.current.clientX;
    posRef.current.pos4 = elementRef.current.clientY;

    document.addEventListener('mouseup', closeDragElement);
    // call a function whenever the cursor moves:
    document.addEventListener('mousemove', elementDrag);
  };

  function elementDrag(e) {
    e.preventDefault();

    const rect = elementRef.current.getBoundingClientRect();
    // calculate the new cursor position:
    posRef.current.pos1 = posRef.current.pos3 - e.clientX;
    posRef.current.pos2 = posRef.current.pos4 - e.clientY;
    posRef.current.pos3 = e.clientX;
    posRef.current.pos4 = e.clientY;
    // set the element's new position:
    const offsetRight = window.innerWidth - rect.right;

    const prefferedTop = elementRef.current.offsetTop - posRef.current.pos2;
    const preferredRight = offsetRight + posRef.current.pos1;

    const top = Math.min(-10 + window.innerHeight - rect.height, Math.max(prefferedTop, 10));
    const right = Math.min(-10 + window.innerWidth - rect.width, Math.max(preferredRight, 10));

    elementRef.current.style.top = `${ top }px`;
    elementRef.current.style.right = `${ right }px`;
  }

  function closeDragElement() {
    setDragging(false);
    // stop moving when mouse button is released:
    document.removeEventListener('mouseup', closeDragElement);
    document.removeEventListener('mousemove', elementDrag);
  }

  return {
    elementRef,
    onMouseDownHandler,
    dragging,
  };
};

export default useDrag;
