var commandMap = {
  ESCAPE: 'KEY_ESC',
  MENU: '229',
  ESC: 'KEY_LEFT_ESC',
  END: 'KEY_END',
  SPACE: '\' \'',
  TAB: 'KEY_TAB',
  PRINTSCREEN: '206',
  ENTER: 'KEY_RETURN',
  UPARROW: 'KEY_UP_ARROW',
  DOWNARROW: 'KEY_DOWN_ARROW',
  LEFTARROW: 'KEY_LEFT_ARROW',
  RIGHTARROW: 'KEY_RIGHT_ARROW',
  UP: 'KEY_UP_ARROW',
  DOWN: 'KEY_DOWN_ARROW',
  LEFT: 'KEY_LEFT_ARROW',
  RIGHT: 'KEY_RIGHT_ARROW',
  PAGEUP: 'KEY_PAGE_UP',
  PAGEDOWN: 'KEY_PAGE_DOWN',
  CAPSLOCK: 'KEY_CAPS_LOCK',
  DELETE: 'KEY_DELETE',
  DEL: 'KEY_DELETE',
  F1: 'KEY_F1',
  F2: 'KEY_F2',
  F3: 'KEY_F3',
  F4: 'KEY_F4',
  F5: 'KEY_F5',
  F6: 'KEY_F6',
  F7: 'KEY_F7',
  F8: 'KEY_F8',
  F9: 'KEY_F9',
  F10: 'KEY_F10',
  F11: 'KEY_F11',
  F12: 'KEY_F12'
};

var comboMap = {
  ALT: 'KEY_LEFT_ALT',
  GUI: 'KEY_LEFT_GUI',
  WINDOWS: 'KEY_LEFT_GUI',
  COMMAND: 'KEY_LEFT_GUI',
  CTRL: 'KEY_LEFT_CTRL',
  CONTROL: 'KEY_LEFT_CTRL',
  SHIFT: 'KEY_LEFT_SHIFT'
};

var keyMap = {
  a: '97',
  b: '98',
  c: '99',
  d: '100',
  e: '101',
  f: '102',
  g: '103',
  h: '104',
  i: '105',
  j: '106',
  k: '107',
  l: '108',
  m: '109',
  n: '110',
  o: '111',
  p: '112',
  q: '113',
  r: '114',
  s: '115',
  t: '116',
  u: '117',
  v: '118',
  w: '119',
  x: '120',
  y: '121',
  z: '122'
};

class Ducky2Arduino {
  constructor() {
    this.keyMap = keyMap;
    this.commandMap = commandMap;
    this.comboMap = comboMap;
  }

  compile(inputCode) {
    if (inputCode == '' || inputCode == undefined) {
      console.error('[ERROR] : No ducky script was entered!');
      return 'Error! Please Look At The Console.....';
    }
    var parsedDucky = this.parser(inputCode);
    if (parsedDucky == '' || parsedDucky == undefined) {
      return 'Error! Please Look At The Console.....';
    }
    return '/**\n'
      + 'This Code Is Converted By Ducky2Arduino An Online Tool.\n'
      + 'This Code Is Made By Nakshatra Ranjan Saha (OCEAN OF ANYTHING)\n'
      + 'Check Out The Tool At https://oceanofanythingofficial.github.io/Ducky2Arduino\n\n'
      + 'Now Just Enjoy ;)\n'
      + '**/\n\n\n'
      + '#include <HID-Project.h>\n'
      + '#include <HID-Settings.h>\n\n'
      + '// Utility function\n'
      + 'void typeKey(int key){\n'
      + '  Keyboard.press(key);\n'
      + '  delay(50);\n'
      + '  Keyboard.release(key);\n'
      + '}\n\n'
      + 'void setup()\n'
      + '{\n'
      + '  // Start Keyboard and Mouse\n'
      + '  AbsoluteMouse.begin();\n'
      + '  Keyboard.begin();\n\n'
      + '  // Starting Point Of Payload\n'
      + parsedDucky
      + '\n'
      + '  // End Point Of Payload\n\n'
      + '  // Stop Keyboard and Mouse\n'
      + '  Keyboard.end();\n'
      + '  AbsoluteMouse.end();\n'
      + '}\n'
      + '\n'
      + '// Unused\n'
      + 'void loop() {}';
  }
  parser(toParse) {
    var timerStart = Date.now();
    var parsedScript = '';
    toParse = toParse.replace(/^ +| +$/gm, "");
    var lineArray = toParse.split('\n');
    for (var i = 0; i < lineArray.length; i++) {
      if (lineArray[i] === '' || lineArray[i] === '\n') {
        console.log('[INFO] : Skipped Line ' + (i + 1) + ', Because Line ' + (i + 1) + ' Was Empty.');
        continue;
      }
      var releaseAll = false;
      if (parsedOut !== undefined && parsedOut !== '') {
        var lastLines = parsedOut;
        var lastCount = ((lastLines.split('\n')).length + 1);
      }
      var parsedOut = '';
      var commandKnown = false;
      var wordArray = lineArray[i].split(' ');
      var wordOne = wordArray[0];
      switch (wordOne) {
        case "STRING":
          wordArray.shift();
          var textString = wordArray.join(' ');
          textString = textString.split('\\').join('\\\\').split('"').join('\\"');
          if (textString !== '') {
            parsedOut += '  Keyboard.print("' + textString + '");\n';
            commandKnown = true;
          } else {
            console.error('[ERROR] : At Line: ' + (i + 1) + ', `STRING` Needs A Text');
            return;
          }
          break;
        case "DELAY":
          wordArray.shift();
          if (wordArray[0] === undefined || wordArray[0] === '') {
            console.error('[ERROR]: At Line: ' + (i + 1) + ', `DELAY` Needs A Time');
            return;
          }
          if (!isNaN(wordArray[0])) {
            parsedOut += '  delay(' + wordArray[0] + ');\n';
            commandKnown = true;
          } else {
            console.error('[ERROR] : At Line: ' + (i + 1) + ', `DELAY` Only Allows Numbers');
            return;
          }
          break;
        case "TYPE":
          wordArray.shift();
          if (wordArray[0] === undefined || wordArray[0] === '') {
            console.error('[ERROR] : At Line: ' + (i + 1) + ', TYPE Needs A Key');
            return;
          }
          if (keyMap[wordArray[0]] !== undefined) {
            commandKnown = true;
            parsedOut += '  typeKey(' + keyMap[wordArray[0]] + ');\n';
          } else {
            console.error('[ERROR] : Unknown Letter \'' + wordArray[0] + '\' At Line: ' + (i + 1));
            return;
          }
          break;
        case "REM":
          wordArray.shift();
          if (wordArray[0] !== undefined && wordArray[0] !== '') {
            commandKnown = true;
            parsedOut += '  // ' + wordArray.join(' ') + '\n';
          } else {
            console.error('[ERROR] : At Line: ' + (i + 1) + ', REM Needs A Comment');
            return;
          }
          break;
        case "MOUSEMOVE":
          wordArray.shift();
          if (wordArray[0] != undefined && wordArray[0] != '') {
            commandKnown = true;
            var mouseParams = wordArray[0].split(',');
            parsedOut += '  AbsoluteMouse.move(' + mouseParams[0] + ', ' + mouseParams[1];
            if (mouseParams[2] != undefined && mouseParams[2] != '') {
              parsedOut += ', ' + mouseParams[2];
            }
            parsedOut += ');\n';
            wordArray.shift();
          } else {
            console.error('[ERROR] : At Line: ' + (i + 1) + ', MOUSEMOVE Requires At Least Two Parameters')
            return;
          }
          break;
        case "MOUSECLICK":
          wordArray.shift();
          wordArray[0] = wordArray[0].toUpperCase();
          if (wordArray[0] == 'LEFT' || wordArray[0] == 'RIGHT' || wordArray[0] == 'MIDDLE' && wordArray[0] != undefined && wordArray[0] != '') {
            commandKnown = true;
            parsedOut += '  AbsoluteMouse.click(MOUSE_' + wordArray[0] + ');\n'
            wordArray.shift();
          } else {
            console.error('[ERROR] : At Line: ' + (i + 1) + ', MOUSECLICK Requires Key (left/middle/right)')
            return;
          }
          break;
        case "REPEAT":
        case "REPLAY":
          wordArray.shift();
          if (wordArray[0] === undefined || wordArray[0] === '') {
            console.error('[ERROR] : At Line: ' + (i + 1) + ', REPEAT/REPLAY Needs A Loop Count');
            return;
          }
          if (lastLines === undefined) {
            console.error('[ERROR] : At Line: ' + (i + 1) + ', Nothing To Repeat, This Is The First Line.');
            return;
          }
          if (!isNaN(wordArray[0])) {
            var linesTmp = parsedScript.split('\n');
            linesTmp.splice(-lastCount, lastCount);
            if (linesTmp.join('\n') === '')
              parsedScript = linesTmp.join('\n');
            else {
              parsedScript = linesTmp.join('\n') + '\n';
            }
            lastLines = lastLines.replace(/^  /gm, '    ');
            parsedOut += '  for(int i = 0; i < ' + wordArray[0] + '; i++) {\n';
            parsedOut += lastLines;
            parsedOut += '  }\n';
            commandKnown = true;
          } else {
            console.error('[ERROR] : At Line: ' + (i + 1) + ', REPEAT/REPLAY Only Allows Numbers');
            return;
          }
          break;
        default:
          if (wordArray.length == 1) {
            if (comboMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              parsedOut += '  typeKey(' + comboMap[wordArray[0]] + ');\n';
            } else if (commandMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              parsedOut += '  typeKey(' + commandMap[wordArray[0]] + ');\n';
            } else {
              commandKnown = false;
              break;
            }
            wordArray.shift();
          }
          while (wordArray.length) {
            if (comboMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              releaseAll = true;
              parsedOut += '  Keyboard.press(' + comboMap[wordArray[0]] + ');\n';
            } else if (commandMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              releaseAll = true;
              parsedOut += '  Keyboard.press(' + commandMap[wordArray[0]] + ');\n';
            } else if (keyMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              releaseAll = true;
              parsedOut += '  Keyboard.press(' + keyMap[wordArray[0]] + ');\n';
            } else {
              commandKnown = false;
              break;
            }
            wordArray.shift();
          }
      }
      if (!commandKnown) {
        console.error('[ERROR] : Unknown Command, key Or Input \'' + wordArray[0] + '\' At Line: ' + (i + 1) + '.');
        return;
      }
      if (releaseAll)
        parsedOut += '  Keyboard.releaseAll();\n';
      parsedScript += parsedOut;
      if (i != (lineArray.length - 1))
        parsedScript += '\n';
    }
    var timerEnd = Date.now();
    var timePassed = new Date(timerEnd - timerStart);
    console.log('Successfuly Converted ' + (lineArray.length) + ' Lines Of Code ' + timePassed.getMilliseconds() + ' Milli Seocnds');
    return parsedScript;
  }
}
