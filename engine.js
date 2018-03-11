window.engine = (function () {
  const id = g => g

  // What node will we be drawing on? Defaults to body
  let rootNode = document.getElementById('body')

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

  const engine = {
    tlog: tlog,
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

      // normalize within 0-359
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
