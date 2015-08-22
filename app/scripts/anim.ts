// module for animation

module Anim {

  // requestAnimationFrame polyfill
  var raf = window.requestAnimationFrame || function (callback: (number) => void) {
    return window.setTimeout(function () {
      var currTime = new Date().getTime();
      callback(currTime);
    }, 10);
  };

  // force redraw
  export var redraw = function (el) {
    el.style.zIndex = el.clientWidth;
  };

  // ease functions, from [0, 1] to [0, 1]
  export var ease: {[name: string]: (number) => number} = {
    cubicInOut: function (i: number): number {
      var o: number = 2 * i;
      if (o > 0.5) {
        o = Math.pow(o - 2, 3) + 2;
      } else {
        o = Math.pow(o, 3);
      }
      return o / 2;
    },
    cubicOut: function (i: number): number {
      return Math.pow(i - 1, 3) + 1;
    }
  };

  // animation function, taking frame function (return true to continue), duration, ease function and finish callback
  export var $ = function (frame: (number) => boolean, duration: number, easeFunc: (number) => number = ease['cubicInOut'], onfinish?: () => void) {
    var start: number = 0;
    var callback = function (time: number) {
      if (start === 0) {
        start = time;
      }
      var progress: number = (time - start) / duration;
      if (progress > 1) { progress = 1; } else { progress = easeFunc(progress); }
      if (!callback(progress)) { return; }
      if (progress === 1) { if (onfinish) { onfinish(); } return; }
      raf(callback);
    };
    raf(callback);
  };

}
