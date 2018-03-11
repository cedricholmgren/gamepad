function mapButtons (gamepad) {
  if (gamepad === null) return null

  let buttons = gamepad.buttons.reduce((buttonMap, b, i) => {
    if (!b.pressed) return buttonMap

    let n = Object.assign({}, buttonMap)

    switch (i) {
      case 0:
        n['A'] = true;
        n['pressed'].push('A')
      break;
      case 1:
        n['B'] = true;
        n['pressed'].push('B')
      break;
      case 2:
        n['X'] = true;
        n['pressed'].push('X')
      break;
      case 3:
        n['Y'] = true;
        n['pressed'].push('Y')
      break;
      case 4:
        n['LB'] = true;
        n['pressed'].push('LB')
      break;
      case 5:
        n['RB'] = true;
        n['pressed'].push('RB')
      break;
      case 6:
        n['LT'] = b.value;
        n['pressed'].push('LT')
      break;
      case 7:
        n['RT'] = b.value;
        n['pressed'].push('RT')
      break;
      case 8:
        n['BACK'] = true;
        n['pressed'].push('BACK')
      break;
      case 9:
        n['START'] = true;
        n['pressed'].push('START')
      break;
      case 10:
        n['LS'] = true;
        n['pressed'].push('LS')
      break;
      case 11:
        n['RS'] = true;
        n['pressed'].push('RS')
      break;
      case 12:
        n['DU'] = true;
        n['pressed'].push('DU')
      break;
      case 13:
        n['DD'] = true;
        n['pressed'].push('DD')
      break;
      case 14:
        n['DL'] = true;
        n['pressed'].push('DL')
      break;
      case 15:
        n['DR'] = true;
        n['pressed'].push('DR')
      break;
    }

    return n
  }, { pressed: [] })

  return buttons
}


// --------------------------------------
// Animation loop
// --------------------------------------
function runAnimation() {
  // Get the latest gamepad state.
  var gamepads = navigator.getGamepads();
  
  let output1 = '', output2 = ''

  if (gamepads[0]) {
    output1 = `Player 1 has a gamepad connected. He has ${mapButtons(gamepads[0]).pressed.join(' and ')} buttons pushed.`
  }
  
  if (gamepads[1]) {
    output2 = `Player 2 has a gamepad connected. He has ${mapButtons(gamepads[1]).pressed.join(' and ')} buttons pushed.`
  }

  document.getElementById("output").innerHTML = output1 + '<br />' + output2

  window.requestAnimationFrame(runAnimation);
}

window.requestAnimationFrame(runAnimation);

