const LONG_PRESS_START = 'longPressStart'
const LONG_PRESS_END = 'longPressEnd'
const LONG_PRESS_INTERVAL = 'longPressInterval'

export default ({ delay = 500, interval = 50 }) => ({
  mounted: function (el, binding, vNode) {
    const funDelay = binding?.value?.delay || delay;
    const funInterval = binding?.value?.interval || interval;
    let pressTimer = null
    let pressInterval = null

    const start = (e) => {
      if (e.type === 'click' && e.button !== 0) {
        return
      }
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          if (funInterval && funInterval > 0) {
            pressInterval = setInterval(() => {
              emitEvent(vNode, LONG_PRESS_INTERVAL, e)
            }, funInterval)
          }
          emitEvent(vNode, LONG_PRESS_INTERVAL, e)
          emitEvent(vNode, LONG_PRESS_START, e)
        }, funDelay)
      }
    }

    // Cancel Timeout
    const cancel = (e) => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        pressTimer = null
      }
      if (pressInterval) {
        clearInterval(pressInterval)
        pressInterval = null
        emitEvent(vNode, LONG_PRESS_END, e)
      }
    }


    ['mousedown', 'touchstart'].forEach(e => {
      el.addEventListener(e, start, { passive: true })
    });
    ['click', 'mouseout', 'touchend', 'touchcancel'].forEach(e => {
      el.addEventListener(e, cancel, { passive: true })
    })
  }
})


function emitEvent(vNode, eventName, e) {
  if (vNode.componentInstance) {
    vNode.componentInstance.$emit(eventName, { detail: e }); // use {detail:} to be uniform
  } else {
    vNode.el.dispatchEvent(new CustomEvent(eventName, { detail: e }));
  }
}