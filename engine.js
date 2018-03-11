window.engine = (function () {
  const id = g => g

  // what node will we be drawing on? defaults to body
  let rootNode = document.getElementById('body')

  // tracks all keyboard events
  let onKeyDownCallbacks = {}
  let onKeyUpCallbacks = {}
  let onKeyPressCallbacks = {}

  // throttle console logs, to keep from blowing up the compy
  let throttle = window.performance.now()
  const tlog = g => {
    const now = window.performance.now()
    if ((now - throttle) > 1000) {
      throttle = now
      console.log(g)
    }
  }

  const normalize = (num, range) => (num + (range * 10)) % range
  const bound = (num, min, max) => Math.min(Math.max(min, num), max)
  const round = (num, places) => Math.round(num / places) * places
  const keyCodes = { 8: "backspace", 9: "tab", 13: "enter", 16: "shift", 17: "ctrl", 18: "alt", 20: "capslock", 27: "escape", 32: "spacebar", 33: "pgup", 34: "pgdn", 35: "end", 36: "home", 37: "left", 38: "up", 39: "right", 40: "down", 48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9", 58: ":", 60: "<", 65: "a", 66: "b", 67: "c", 68: "d", 69: "e", 70: "f", 71: "g", 72: "h", 73: "i", 74: "j", 75: "k", 76: "l", 77: "m", 78: "n", 79: "o", 80: "p", 81: "q", 82: "r", 83: "s", 84: "t", 85: "u", 86: "v", 87: "w", 88: "x", 89: "y", 90: "z", 96: "num0", 97: "num1", 98: "num2", 99: "num3", 100: "num4", 101: "num5", 102: "num6", 103: "num7", 104: "num8", 105: "num9", 107: "num+", 109: "num-", 110: "num.", 111: "num/", 160: "^", 161: '!', 163: "#", 164: '$', 170: '*', 188: ",", 190: ".", 191: "/", 219: "[", 220: "\\", 221: "]", 222: "'", 223: "`" }

  const engine = {
    tlog: tlog,
    keyCodes: keyCodes,
    setRootNode: (nodeName) => (rootNode = document.getElementById(nodeName)),

    /**
     * Draws a sprite on the screen. Props should have an
     * id, x, y, width, height, and sprite property at least.
     * 
     * The origin will be set to the middle unless otherwise specified.
     */
    draw: (props) => {
      const obj = document.createElement('img')
      obj.id = props.id
      rootNode.appendChild(obj)
      return props
    },

    /**
     * Updates a given object with the new properties.
     */
    update: (props) => {
      const obj = document.getElementById(props.id)
      // if (!obj) { alert(`Element ${props.id} doesn't exist.`); return }

      const { x, y, width, height, direction, sprite, alpha } = props

      // TODO: allow setting origin
      const tx = round(x - (width / 2), 0.1)
      const ty = round(y - (height / 2), 0.1)

      obj.src = `./assets/${sprite}`
      obj.style.display = 'block'
      obj.style.position = 'absolute'
      obj.style.width = `${width}px`
      obj.style.height = `${height}px`
      obj.style.opacity = alpha
      obj.style.filter = `blur(${props.blur || 0}px)`
      obj.style.transform = `translate(${tx}px,${ty}px) rotate(${direction}deg)`

      // return for chaining
      return props
    },

    advance: (props) => {
      // update speed based on thrust and maxspeed
      props.speed += (props.thrust * props.acceleration)
      props.speed = bound(props.speed, props.maxReverse, props.maxSpeed)
      props.speed *= 0.99
      if (props.speed < 0.05 && props.speed > -0.05) props.speed = 0

      // turn, and then normalize within 0-359
      props.direction += props.turn
      props.direction = normalize(props.direction, 360)

      // now advance by speed in the direction pointed
      props.x += props.speed * Math.cos((props.direction - 90) * Math.PI / 180);
      props.y += props.speed * Math.sin((props.direction - 90) * Math.PI / 180);

      // strafe sideways
      props.x += props.strafe * Math.cos((props.direction) * Math.PI / 180);
      props.y += props.strafe * Math.sin((props.direction) * Math.PI / 180);

      // return for chaining
      return props
    },

    /**
     * Distance between two objects. Pythagorean theorem.
     */
    distanceToObj: (a, b) => {
      const x = Math.abs(a.x - b.x)
      const y = Math.abs(a.y - b.y)
      return Math.sqrt(x * x + y * y)
    },

    /**
     * Angle from one obj to another. Trig.
     */
    directionToObj: (a, b) => (Math.atan2(a.y - b.y, a.x - b.x) / Math.PI * 180) + 270,

    /** 
     * Delta between two angles.
     */
    deltaBetween: (a, b) => {
      let d = b - a
      d = d >= 180 ? d - 360 : d
      d = d <= -180 ? d + 360 : d
      return d
    },

    /**
     * Tells you if one object is in view of the other object based on
     * distance and angle delta. Will also tell you _how_ in view it is,
     * 0-1.0, with 1 being fully in view, 0 not in view, 0.5 halfway in view.
     * We use the last 25% of the distance and last 25% of the angle delta to
     * determine how in view it is.
     * 
     * e.g. isInView(myObj, otherObj, { distance: 100, angleDelta: 90 })
     */
    isInView: (myObj, otherObj, props) => {
      let result = 1

      if (props.distance) {
        let distance = engine.distanceToObj(myObj, otherObj)
        result = bound((props.distance - distance) / (props.distance * 0.25), 0, 1)
      }

      if (props.angleDelta) {
        let dir = engine.directionToObj(myObj, otherObj)
        let angleDelta = Math.abs(engine.deltaBetween(myObj.direction, dir))
        result = result * bound((props.angleDelta - angleDelta) / (props.angleDelta * 0.25), 0, 1)
      }

      return result
    },

    keyboard: {
      clearKeyDown: (key) => { onKeyDownCallbacks[key] = undefined },
      clearAllKeyDown: () => { onKeyDownCallbacks = {} },
      onKeyDown: (key, callback) => {
        onKeyDownCallbacks[key] = callback // only one event per keyEvent
        document.onkeydown = (e) => {
          const pressedKey = keyCodes[e.keyCode]
          if (onKeyDownCallbacks[pressedKey]) onKeyDownCallbacks[pressedKey]()
        }
      },
      clearKeyUp: (key) => { onKeyUpCallbacks[key] = undefined },
      clearAllKeyUp: () => { onKeyUpCallbacks = {} },
      onKeyUp: (key, callback) => {
        onKeyUpCallbacks[key] = callback // only one event per keyEvent
        document.onkeyup = (e) => {
          const pressedKey = keyCodes[e.keyCode]
          if (onKeyUpCallbacks[pressedKey]) onKeyUpCallbacks[pressedKey]()
        }
      },
      clearKeyPress: (key) => { onKeyPressCallbacks[key] = undefined },
      clearAllKeyPress: () => { onKeyPressCallbacks = {} },
      onKeyPress: (key, callback) => {
        onKeyPressCallbacks[key] = callback // only one event per keyEvent
        document.onkeypress = (e) => {
          const pressedKey = keyCodes[e.keyCode]
          if (onKeyPressCallbacks[pressedKey]) onKeyPressCallbacks[pressedKey]()
        }
      },
    },

    gamepad: {
      all: () => {
        const gamepads = Array.from(navigator.getGamepads()).filter(id)
        return gamepads.map(gamepad => {
          if (gamepad === null) return null

          let buttons = gamepad.buttons.reduce((buttonMap, b, i) => {
            if (!b.pressed) return buttonMap

            let n = { pressed: [] }

            switch (i) {
              case 0: n['A'] = true; n['pressed'].push('A'); break;
              case 1: n['B'] = true; n['pressed'].push('B'); break;
              case 2: n['X'] = true; n['pressed'].push('X'); break;
              case 3: n['Y'] = true; n['pressed'].push('Y'); break;
              case 4: n['LB'] = true; n['pressed'].push('LB'); break;
              case 5: n['RB'] = true; n['pressed'].push('RB'); break;
              case 6: n['LT'] = b.value; n['pressed'].push('LT'); break;
              case 7: n['RT'] = b.value; n['pressed'].push('RT'); break;
              case 8: n['BACK'] = true; n['pressed'].push('BACK'); break;
              case 9: n['START'] = true; n['pressed'].push('START'); break;
              case 10: n['LS'] = true; n['pressed'].push('LS'); break;
              case 11: n['RS'] = true; n['pressed'].push('RS'); break;
              case 12: n['DU'] = true; n['pressed'].push('DU'); break;
              case 13: n['DD'] = true; n['pressed'].push('DD'); break;
              case 14: n['DL'] = true; n['pressed'].push('DL'); break;
              case 15: n['DR'] = true; n['pressed'].push('DR'); break;
            }

            return Object.assign({}, buttonMap, n)
          }, {})

          const axis = Array.from(gamepad.axes)

          return { buttons, axis }
        })
      }
    }
  }
  return engine
})()
