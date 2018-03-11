setTimeout((function () {
  const engine = window.engine
  const { gamepad, draw } = engine

  const midX = window.innerWidth / 2
  const midY = window.innerHeight / 2

  let state = {
    spaceships: [{
      id: 'player-1',
      x: midX - 90,
      y: midY,
      width: 172 / 5,
      height: 302 / 5,
      sprite: 'ship-orange-main.png'
    }, {
      id: 'player-2',
      x: midX + 90,
      y: midY,
      width: 172 / 5,
      height: 302 / 5,
      sprite: 'ship-blue-main.png'
    }, {
      id: 'mother-ship',
      x: midX,
      y: midY,
      width: 450 / 5,
      height: 750 / 5,
      sprite: 'mother-ship.png'
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
