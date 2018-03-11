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
      speed: 0,
      sprite: 'ship-orange-main.png'
    }, {
      id: 'player-2',
      x: midX + 90,
      y: midY,
      width: 172 / 5,
      height: 302 / 5,
      direction: 0,
      speed: 0,
      sprite: 'ship-blue-main.png'
    }, {
      id: 'mother-ship',
      x: midX,
      y: midY,
      width: 450 / 5,
      height: 750 / 5,
      direction: 0,
      speed: 0,
      sprite: 'mother-ship.png'
    }]
  }

  function setup() {
    engine.setRootNode('gameCanvas')

    state.spaceships.map(draw)
  }

  function updateAll() {
    // Get the latest gamepad state.
    const gamepads = gamepad.all()
    let p1 = gamepads[0]
    let p2 = gamepads[1]
    if (p1) {
      // ready player one
      state.spaceships[0].speed = p1['RT']
    }
    if (p2) {
      // ready player two
      state.spaceships[1].speed = p2['RT']
    }

    // state.spaceships[0].direction -= 1
    // state.spaceships[1].direction += 1

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
