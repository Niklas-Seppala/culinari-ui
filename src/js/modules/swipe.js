
let touchStart = {
  x: undefined,
  y: undefined,
}
let touchEnd = {
  x: undefined,
  y: undefined
}

/** @type {(dist: {x: number, y: number}) => boolean} */
let touchValidator = null;

/** @type {(dist: {x: number, y: number}) => void} */
let onLeftSwipe = null

/** @type {(dist: {x: number, y: number}) => void} */
let onRightSwipe = null


const setTouchEvents = () => {
  window.addEventListener('touchstart', eArgs => {
    const [touch] = eArgs.changedTouches;
    touchStart.x = touch.screenX;
    touchStart.y = touch.screenY
  });

  window.addEventListener('touchend', eArgs => {
    const [touch] = eArgs.changedTouches;
    touchEnd.x = touch.screenX;
    touchEnd.y = touch.screenY;

    const distance = {
      x: Math.abs(touchEnd.x - touchStart.x),
      y: Math.abs(touchEnd.y - touchStart.y),
    }

    if (touchValidator ? touchValidator.call(this, distance) : true) {
      touchEnd.x < touchStart.x 
        ? onLeftSwipe?.call(this, distance) 
        : onRightSwipe?.call(this, distance)
    }
  });
}

/**
 * 
 * @param {{
 * left: (dist: {x: number, y: number}) => void,
 * right: (dist: {x: number, y: number}) => void,
 * validator: (dist: {x: number, y: number}) => boolean
 * }} configs 
 */
const configure = ({left, right, validator}) => {
  if (!left || !right) throw Error('right and left swipe listeners must be defined');
  onLeftSwipe = left;
  onRightSwipe = right;
  touchValidator = validator;
  setTouchEvents();
}

export default {configure}






// export default class SwipeHandler {
//   static handlersSet = false;

//   #touchStartX = -1;
//   #touchStartY = -1;
//   #touchEndX = -1;
//   #touchEndY = -1;

//   constructor({ left, right, minDistX, maxDistY }) {
//     this.leftSwipe = left;
//     this.rightSwipe = right;
//     this.minDistX = minDistX;
//     this.maxDistY = maxDistY;

//     if (!SwipeHandler.handlersSet) this.#setEvents();
//   }

//   #setEvents() {
//     window.addEventListener('touchstart', eArgs => {
//       const [touch] = eArgs.changedTouches;
//       this.#touchStartX = touch.screenX;
//       this.#touchStartY = touch.screenY;
//     });

//     window.addEventListener('touchend', eArgs => {
//       const [touch] = eArgs.changedTouches;
//       this.#touchEndX = touch.screenX;
//       this.#touchEndY = touch.screenY;

//       if (this.minDistX && this.maxDistY) {
//         // Gurad against angled vertical scroll.
//         const distY = Math.abs(this.#touchEndY - this.#touchStartY);
//         if (distY > this.maxDistY) return;

//         // Check the distance of the swipe.
//         const dist = Math.abs(this.#touchEndX - this.#touchStartX);
//         if (dist < this.minDistX) return;
//       }

//       if (this.#touchEndX < this.#touchStartX) this.rightSwipe?.call();
//       else this.leftSwipe?.call();
//     });
//     SwipeHandler.handlersSet = true;
//   }
// }
