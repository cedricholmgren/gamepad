setTimeout((function () {
  const engine = window.engine
  const { gamepad, draw } = engine

  const midX = window.innerWidth / 2
  const midY = window.innerHeight / 2

  let state = {
    spaceships: [{
      id: 'ship-1',
      x: midX - 30,
      y: midY,
      width: 172 / 4,
      height: 302 / 4,
      sprite: 'ship-orange-1.png'
    }, {
      id: 'ship-2',
      x: midX + 30,
      y: midY,
      width: 172 / 4,
      height: 302 / 4,
      sprite: 'ship-orange-2.png'
    }]
  }

  function setup() {
    engine.setRootNode('gameCanvas')

    state.spaceships.forEach(draw)
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
  }

  setup()
  engine.run(gameloop)

}), 100)
