setTimeout((function () {
  const engine = window.engine
  const { gamepad, draw, advance, update } = engine

  const midX = window.innerWidth / 2
  const midY = window.innerHeight / 2

  let state = {
    spaceships: [{
      id: 'ship-1',
      x: midX - 30,
      y: midY,
      width: 172 / 4,
      height: 302 / 4,
      direction: 0,
      speed: 2,
      sprite: 'ship-orange-1.png'
    }, {
      id: 'ship-2',
      x: midX + 30,
      y: midY,
      width: 172 / 4,
      height: 302 / 4,
      direction: 0,
      speed: 1,
      sprite: 'ship-orange-2.png'
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
