let touchStart = {
  x: undefined,
  y: undefined,
};
let touchEnd = {
  x: undefined,
  y: undefined,
};

/** @type {(dist: {x: number, y: number}) => boolean} */
let touchValidator = null;

/** @type {(dist: {x: number, y: number}) => void} */
let onLeftSwipe = null;

/** @type {(dist: {x: number, y: number}) => void} */
let onRightSwipe = null;

const setTouchEvents = () => {
  window.addEventListener('touchstart', e => {
    const [touch] = e.changedTouches;
    touchStart.x = touch.screenX;
    touchStart.y = touch.screenY;
  });

  window.addEventListener('touchend', e => {
    const [touch] = e.changedTouches;
    touchEnd.x = touch.screenX;
    touchEnd.y = touch.screenY;

    // Calculate distance.
    const distance = {
      x: Math.abs(touchEnd.x - touchStart.x),
      y: Math.abs(touchEnd.y - touchStart.y),
    };

    // Call validator if it exists
    if (touchValidator ? touchValidator.call(this, distance) : true) {
      touchEnd.x < touchStart.x // calculate swipe direction.
        ? onLeftSwipe?.call(this, distance)
        : onRightSwipe?.call(this, distance);
    }
  });
};

/**
 * Configure horizontal swipe detection.
 *
 * @param {{
 * left: (dist: {x: number, y: number}) => void,
 * right: (dist: {x: number, y: number}) => void,
 * validator: (dist: {x: number, y: number}) => boolean
 * }} configs
 */
const configure = ({ left, right, validator }) => {
  if (!left || !right) throw Error('right and left swipe listeners must be defined');
  onLeftSwipe = left;
  onRightSwipe = right;
  touchValidator = validator;
  setTouchEvents();
};

export default { configure };
