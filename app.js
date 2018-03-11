setTimeout((function () {
  const engine = window.engine
  const { gamepad, keyboard, draw, advance, update, tlog } = engine

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
      turn: 0,
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
      turn: 0,
      speed: 0,
      strafe: 0,
      maxSpeed: 1.5,
      maxReverse: -0.5,
      acceleration: 0.1,
      thrust: 0,
      alpha: 0.5,
      blur: 2,
      sprite: 'ship-orange-main.png'
    }, {
      id: 'player-2',
      x: midX + 90,
      y: midY,
      width: 172 / 5,
      height: 302 / 5,
      direction: 0,
      turn: 0,
      speed: 0,
      strafe: 0,
      maxSpeed: 1.5,
      maxReverse: -0.5,
      acceleration: 0.1,
      thrust: 0,
      alpha: 0.5,
      blur: 2,
      sprite: 'ship-blue-main.png'
    }],
    astroids: [{
      id: 'astroid-1',
      x: 50,
      y: 50,
      width: 256 / 4,
      height: 256 / 4,
      direction: 0,
      speed: 0,
      alpha: 0.5,
      blur: 0,
      sprite: 'ship-blue-main.png'
    }]
  }

  function manageGamepad(gamepad, i) {
    const s = state.spaceships[i + 1]
    s.alpha = Math.min(s.alpha + 0.01, 1)
    s.blur = Math.max(s.blur - 0.01, 0)
    s.thrust = p.buttons['RT'] || ((p.buttons['LT'] || 0) * -1)
    s.turn = p.axis[0] || 0
    s.strafe = (p.axis[2] || 0) * 0.4
  }

  function manageKeyboards() {
    keyboard.onKeyDown('w', () => { state.spaceships[0].thrust = 1 })
    keyboard.onKeyDown('s', () => { state.spaceships[0].thrust = -1 })
    keyboard.onKeyDown('a', () => { state.spaceships[0].turn = -1 })
    keyboard.onKeyDown('d', () => { state.spaceships[0].turn = 1 })
    keyboard.onKeyUp('w', () => { state.spaceships[0].thrust = 0 })
    keyboard.onKeyUp('s', () => { state.spaceships[0].thrust = 0 })
    keyboard.onKeyUp('a', () => { state.spaceships[0].turn = 0 })
    keyboard.onKeyUp('d', () => { state.spaceships[0].turn = 0 })
  }

  function setup() {
    engine.setRootNode('gameCanvas')

    state.astroids.map(draw)
    state.spaceships.map(draw)

    manageKeyboards()
  }

  function checkVisibility(spaceship) {
    const mothership = state.spaceships[0]
    if (mothership === spaceship) return spaceship

    // can see further if pointing at it
    const farVisibility = engine.isInView(mothership, spaceship, {
      distance: 500,
      angleDelta: 70
    })

    // anything within 200 is visible
    const nearVisibility = engine.isInView(mothership, spaceship, {
      distance: 200
    })

    const visibility = Math.max(farVisibility, nearVisibility)

    spaceship.alpha = visibility
    spaceship.blur = 3 - (visibility * 3)
    return spaceship
  }

  // --------------------------------------
  // Animation loop
  // --------------------------------------
  function gameloop() {
    gamepad.all().map(manageGamepad)
    state.spaceships.map(checkVisibility).map(advance).map(update)

    window.requestAnimationFrame(gameloop)
  }

  setup()
  window.requestAnimationFrame(gameloop)

}), 100)
