setTimeout((function () {
  const engine = window.engine
  const { gamepad, draw, advance, update, tlog } = engine

  const midX = window.innerWidth / 2
  const midY = window.innerHeight / 2

  let state = {
    spaceships: [{
      id: 'mother-ship',
      x: midX,
      y: midY,
      width: 450 / 5,
      height: 750 / 5,
      direction: 0,
      speed: 0,
      strafe: 0,
      maxSpeed: 1.5,
      maxReverse: -0.5,
      acceleration: 0.1,
      thrust: 0,
      alpha: 1,
      sprite: 'mother-ship.png'
    }, {
      id: 'player-1',
      x: midX - 90,
      y: midY,
      width: 172 / 5,
      height: 302 / 5,
      direction: 0,
      speed: 0,
      strafe: 0,
      maxSpeed: 1.5,
      maxReverse: -0.5,
      acceleration: 0.1,
      thrust: 0,
      alpha: 0.5,
      sprite: 'ship-orange-main.png'
    }, {
      id: 'player-2',
      x: midX + 90,
      y: midY,
      width: 172 / 5,
      height: 302 / 5,
      direction: 0,
      speed: 0,
      strafe: 0,
      maxSpeed: 1.5,
      maxReverse: -0.5,
      acceleration: 0.1,
      thrust: 0,
      alpha: 0.5,
      sprite: 'ship-blue-main.png'
    }]
  }

  


  function setup() {
    engine.setRootNode('gameCanvas')
    
    state.spaceships.map(draw)
  }

  function updateAll() {
    // Get the latest gamepad state.
    const gamepads = gamepad.all()

    for (i = 0; i <= 1; i += 1) {
      const p = gamepads[i]
      if (p) {
        const s = state.spaceships[i + 1]
        // ready player one
        s.alpha = Math.min(s.alpha + 0.01, 1)
        s.thrust = p.buttons['RT'] || ((p.buttons['LT'] || 0) * -1)

        s.direction += p.axis[0] || 0
        s.strafe = (p.axis[2] || 0) * 0.4
      }
    }

    state.spaceships.map(advance).map(update)
  }

  // --------------------------------------
  // Animation loop
  // --------------------------------------
  function gameloop() {
    updateAll()
    window.requestAnimationFrame(gameloop)
  }

  setup()
  window.requestAnimationFrame(gameloop)

}), 100)
