window.engine = (function () {
  const id = g => g

  // What node will we be drawing on? Defaults to body
  let rootNode = document.getElementById('body')

  return {
    setRootNode: (nodeName) => (rootNode = document.getElementById(nodeName)),

    run: (gameloop) => window.requestAnimationFrame(() => {
      gameloop()
      window.requestAnimationFrame(gameloop)
    }),

    /**
     * Draws a sprite on the screen. Props should have an
     * id, x, y, width, height, and sprite property at least.
     * 
     * The origin will be set to the middle unless otherwise specified.
     */
    draw: (props) => {
      const { x, y, width, height, sprite } = props

      // TODO: allow setting origin
      const tx = x - (width / 2)
      const ty = y - (height / 2)

      const obj = document.createElement('img')
      obj.src = `./assets/${sprite}`
      obj.style.display = 'block'
      obj.style.position = 'absolute'
      obj.style.width = `${width}px`
      obj.style.height = `${height}px`
      obj.style.transform = `translate(${tx}px,${ty}px)`
      obj.id = props.id

      rootNode.appendChild(obj)
    },

    gamepad: {
      all: () => Array.from(navigator.getGamepads()).filter(id),
      mapButtons: (gamepad) => {
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

        return buttons
      }
    }
  }
})()
