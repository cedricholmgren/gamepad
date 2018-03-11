setTimeout((function () {
  const engine = window.engine
  const { gamepad, draw, advance, update } = engine

  const midX = window.innerWidth / 2
  const midY = window.innerHeight / 2

  let state = {
    spaceships: [{
      id: 'player-1',
      x: midX - 90,
      y: midY,
      width: 172 / 5,
      height: 302 / 5,
      direction: 0,
      speed: 2,
      sprite: 'ship-orange-main.png'
    }, {
      id: 'player-2',
      x: midX + 90,
      y: midY,
      width: 172 / 5,
      height: 302 / 5,
      direction: 0,
      speed: 1,
      sprite: 'ship-blue-main.png'
    }, {
      id: 'mother-ship',
      x: midX,
      y: midY,
      width: 450 / 5,
      height: 750 / 5,
      direction: 0,
      speed: 1,
      sprite: 'mother-ship.png'
    }]
  }

  function setup() {
    engine.setRootNode('gameCanvas')

    state.spaceships.map(draw)
  }

  function updateAll() {
    state.spaceships[0].direction -= 1
    state.spaceships[1].direction += 1
    state.spaceships.map(advance).map(update)
  }

  // --------------------------------------
  // Animation loop
  // --------------------------------------
  function gameloop() {
    // Get the latest gamepad state.
    const gamepads = gamepad.all()
    if (gamepads[0]) {
      // ready player one
    }
    if (gamepads[1]) {
      // ready player two
    }

    updateAll()
    window.requestAnimationFrame(gameloop)
  }

  setup()
  window.requestAnimationFrame(gameloop)

}), 100)
