'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

// import _ from 'lodash'
// import $ from 'jquery'

var EQUIVALENTS = {
  db: 'c#',
  eb: 'd#',
  fb: 'e',
  gb: 'f#',
  ab: 'g#',
  bb: 'a#',
  cb: 'b'
};

var notesHistory = [];
var cursor = -1;
var notesToPractice = 100;
var notesLeft = notesToPractice;
var errors = 0;
var startTime = undefined;

var KEYS = {
  A: 65,
  B: 66,
  F: 70,
  SPACE: 32
};

var previousNotes = function previousNotes() {
  cursor = Math.max(cursor - 1, 0);
  display(notesHistory[cursor]);
};

var nextNotes = function nextNotes(toPractice, _ref) {
  var mode = _ref.mode;

  console.log(toPractice);
  var notes = undefined;
  if (mode === 'sequence') {
    notes = toPractice.shift();
  } else {
    notes = _.sample(toPractice);
  }
  notesHistory.push(notes);
  cursor += 1;
  console.log(notes);
  display(notesHistory[cursor]);
};

var playNotes = function playNotes() {
  _.values(notesHistory[cursor]).forEach(function (note) {
    if (EQUIVALENTS[note.slice(1)]) {
      note = note[0] + EQUIVALENTS[note.slice(1)];
    }
    console.log('playing', note);
    // new Audio('./pianonotes/' + note + '.mp3').play()
  });
};

var display = function display(notes) {
  $('.note').remove();
  $('.current-notes').text('');

  if (notes.l) _.each(notes.l, appendLeftHandNote);
  if (notes.r) _.each(notes.r, appendRightHandNote);
};

var STEP = 19.75;
var RIGHT_HAND_MIDDLE_C_TOP = 235.5;
var LEFT_HAND_MIDDLE_C_TOP = 366;
var MIDDLE_C_MIDI_KEY_CODE = 60;
var NOTE_OFFSETS = {
  c: 0,
  'c#': 1, db: 1,
  d: 2,
  'd#': 3, eb: 3,
  e: 4,
  f: 5,
  'f#': 6, gb: 6,
  g: 7,
  'g#': 8, ab: 8,
  a: 9,
  'a#': 10, bb: 10,
  b: 11
};

// midiKeyCodes: int. MIDI code for piano keys.
// but i need to figure out which are left or right hand.

// noteCodes: str. Human-friendly way to transcribe music. Key aware.
// good for displaying, because i only need the note for the placement and the accidental for decoration
// Format: note (abcdefg), accidental (#, b, or n), octave (1-8), fingering (int).

var noteCodeToMidiKeyCode = function noteCodeToMidiKeyCode(noteCode) {
  var _$exec = /([a-g])([b#])?(\d)/.exec(noteCode);

  var _$exec2 = _slicedToArray(_$exec, 4);

  var match = _$exec2[0];
  var note = _$exec2[1];
  var accidental = _$exec2[2];
  var octave = _$exec2[3];

  return MIDDLE_C_MIDI_KEY_CODE + (octave - 4) * 12 + NOTE_OFFSETS[[note, accidental].join('')];
};

var midiKeyCodeToNoteCode = function midiKeyCodeToNoteCode(midiKeyCode) {
  var note = _.invert(NOTE_OFFSETS)[midiKeyCode % 12];
  var octave = Math.floor(midiKeyCode / 12) - 1;
  return note + octave;
};

// console.log(midiKeyCodeToNoteCode(24), 24, 'c1')
// console.log(midiKeyCodeToNoteCode(25), 25, 'db1')
// console.log(midiKeyCodeToNoteCode(26), 26, 'd1')
// console.log(midiKeyCodeToNoteCode(36), 36, 'c2')
// console.log(midiKeyCodeToNoteCode(48), 48, 'c3')
// console.log(midiKeyCodeToNoteCode(60), 60, 'c4')
// console.log(midiKeyCodeToNoteCode(72), 72, 'c5')

// console.log(noteCodeToMidiKeyCode('e1'), 28, 'e1')
// console.log(noteCodeToMidiKeyCode('f1'), 29, 'f1')
// console.log(noteCodeToMidiKeyCode('gb1'), 30, 'gb1')
// console.log(noteCodeToMidiKeyCode('f#1'), 30, 'f#1')
// console.log(noteCodeToMidiKeyCode('g1'), 31, 'g1')
// console.log(noteCodeToMidiKeyCode('ab1'), 32, 'ab1')
// console.log(noteCodeToMidiKeyCode('a1'), 33, 'a1')
// console.log(noteCodeToMidiKeyCode('bb1'), 34, 'bb1')
// console.log(noteCodeToMidiKeyCode('b1'), 35, 'b1')
// console.log(noteCodeToMidiKeyCode('c2'), 36, 'c2')
// console.log(noteCodeToMidiKeyCode('db2'), 37, 'db2')
// console.log(noteCodeToMidiKeyCode('d2'), 38, 'd2')
// console.log(noteCodeToMidiKeyCode('eb2'), 39, 'eb2')
// console.log(noteCodeToMidiKeyCode('e2'), 40, 'e2')
// console.log(noteCodeToMidiKeyCode('f2'), 41, 'f2')
// console.log(noteCodeToMidiKeyCode('g2'), 43, 'g2')
// console.log(noteCodeToMidiKeyCode('a2'), 45, 'a2')
// console.log(noteCodeToMidiKeyCode('b2'), 47, 'b2')
// console.log(noteCodeToMidiKeyCode('c2'), 36, 'c2')
// console.log(noteCodeToMidiKeyCode('c3'), 48, 'c3')
// console.log(noteCodeToMidiKeyCode('c4)'), 60, 'c4')
// console.log(noteCodeToMidiKeyCode('c5'), 72, 'c5')
// console.log(noteCodeToMidiKeyCode('c6'), 84, 'c6')
// console.log(noteCodeToMidiKeyCode('c7'), 96, 'c7')
// console.log(noteCodeToMidiKeyCode('g7'), 103, 'g7')

var WHITE_KEY_NOTE_OFFSETS = {
  c: 0,
  d: 1,
  e: 2,
  f: 3,
  g: 4,
  a: 5,
  b: 6
};
var getNoteCodeTop = function getNoteCodeTop(noteCode, hand) {
  console.log(noteCode);

  var _$exec3 = /([a-g])([b#])?(\d)/.exec(noteCode);

  var _$exec4 = _slicedToArray(_$exec3, 4);

  var match = _$exec4[0];
  var note = _$exec4[1];
  var accidental = _$exec4[2];
  var octave = _$exec4[3];

  var steps = (octave - 4) * 7 + WHITE_KEY_NOTE_OFFSETS[note];
  var pxFromMiddleC = steps * -STEP;
  switch (hand) {
    case 'l':
      return pxFromMiddleC + LEFT_HAND_MIDDLE_C_TOP;
    case 'r':
      return pxFromMiddleC + RIGHT_HAND_MIDDLE_C_TOP;
  }
};

// console.log(getNoteCodeTop(103, 'r'), 103, 'r')
// console.log(getNoteCodeTop('c4', 'r'), 'c4', 'r')
// console.log(getNoteCodeTop('d4', 'r'), 'd4', 'r')
// console.log(getNoteCodeTop(103, 'l'), 103, 'l')
// console.log(getNoteCodeTop(60, 'l'), 60, 'l')
// console.log(getNoteCodeTop(28, 'l'), 28, 'l')

var appendNote = function appendNote(hand, noteCode) {
  // const midiKeyCode = noteCodeToMidiKeyCode(noteCode)
  var top = getNoteCodeTop(noteCode, hand);
  $('.staff-container').append('<div style="top: ' + top + 'px" class="note" id="' + noteCode + '">' + noteCode + '</div>');
};

var appendLeftHandNote = _.partial(appendNote, 'l');
var appendRightHandNote = _.partial(appendNote, 'r');

var revealNotes = function revealNotes() {
  $('.current-notes').text(stringifyNotes(notesHistory[cursor]));
};

var stringifyNotes = function stringifyNotes(_ref2) {
  var r = _ref2.r;
  var l = _ref2.l;

  var leftHand = undefined,
      rightHand = undefined;
  if (l) leftHand = 'l: ' + l.join(', ');
  if (r) rightHand = 'r: ' + r.join(', ');
  return _.compact([leftHand, rightHand]).join(', ');
};

var reportError = function reportError() {
  errors += 1;
};

var updateProgress = function updateProgress() {
  notesLeft -= 1;
  var notesPlayed = notesToPractice - notesLeft;
  var score = 100.0 * (notesPlayed - errors) / notesPlayed;
  if (notesLeft === 0) {
    var timeToPlay = (Date.now() - startTime) / 1000.0;
    $('.progress').text('Score: ' + score + '%. Time: ' + timeToPlay.toFixed(1) + ' seconds');
    document.onkeyup = null;
  } else {
    $('.progress').text(notesLeft + ' left! Score: ' + score.toFixed(1) + '%');
  }
};

var onMidiMessage = function onMidiMessage(msg) {
  var _msg$data = _slicedToArray(msg.data, 3);

  var eventType = _msg$data[0];
  var midiKeyCode = _msg$data[1];
  var velocity = _msg$data[2];

  var currentNotes = _.flatten(_.values(notesHistory[cursor]));
  var noteCode = midiKeyCodeToNoteCode(midiKeyCode);

  if (_.contains(currentNotes, noteCode)) {
    if (velocity) {
      $('#' + noteCode).css({ borderColor: 'green' });
    } else {
      $('#' + noteCode).css({ borderColor: 'black' });
    }
  } else {
    if (velocity) {
      // determine hand by looking at current notes. which hand is it closer to? if only one, choose that one.
      appendNote('r', noteCode);
      $('#' + noteCode).css({ borderColor: 'red' });
    } else {
      $('#' + noteCode).remove();
    }
  }
};

var onMIDISuccess = function onMIDISuccess(midiAccess) {
  var inputs = midiAccess.inputs.values();
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = onMidiMessage;
  }
};

var start = function start(toPractice, options) {
  startTime = Date.now();
  var customizedNextNotes = nextNotes.bind(null, toPractice, options);

  document.onkeyup = function (e) {
    switch (e.which) {
      case KEYS.A:
        {
          previousNotes();
          break;
        }
      case KEYS.F:
        {
          updateProgress();
          customizedNextNotes();
          break;
        }
      case KEYS.B:
        {
          reportError();
          updateProgress();
          customizedNextNotes();
          break;
        }
      case KEYS.SPACE:
        {
          revealNotes();
          playNotes();
          break;
        }
    }
  };

  navigator.requestMIDIAccess().then(onMIDISuccess);
  customizedNextNotes();
};

// const nest = any => [any]
// const dFlatMinor = ['dFlat', 'eFlat', 'f', 'gFlat', 'aFlat', 'bFlat', 'c']
// const dFlatMinorNotes = dFlatMinor.map(note => '4' + note).concat(dFlatMinor.map(note => '3' + note)).map(nest)
// const dFlatMinorTrebleClef = dFlatMinor.map(note => ['4' + note]).concat([['3c'], ['3dFlat'], ['3eFlat'], ['3f'], ['3gFlat']])
// const notesIKeepFuckingUp = ['4f', '4dFlat', '4aFlat', '3eFlat', '3dFlat'].map(nest)

var claireDeLune = [
// Staff 3
{ l: ['f3', 'a3'], r: ['b3', 'e4'] }];

// { r: ['d4'] },
// { r: ['e4'] },
// { r: ['d4'] },
// { l: ['e3', 'g3'], r: ['a3', 'c4'] },
// { l: ['a2'] },
// { l: ['d2', 'a2'] },
// { r: ['a3', 'f3'] },
// { l: ['a2', 'c3'] },
// { r: ['f5', 'a5'] },
// { r: ['d5', 'f5'] },
// { l: ['g2', 'd3'] },
// { l: ['d3', 'g3', 'b3', 'd4'], r: ['g4', 'b4', 'e5'] },
// { r: ['f5'] },
// { r: ['e5'] },
// { l: ['g2', 'd3'] },
// // { r: ['a4'] },
// { l: ['f3', 'a3'], r: ['d4', 'd5'] },
// { r: ['d4', 'd5'] },
// { l: ['d4', 'f4'], r: ['a4', 'd5', 'a5'] },
// { l: ['a3', 'd4'], r: ['f4', 'd5', 'g5'] },
// // Staff 4
// { l: ['g2', 'd3'], r: ['f5'] },
// { l: ['d3', 'g3', 'b3', 'd4'], r: ['g4', 'b4', 'e5'] },
// { r: ['f5'] },
// { r: ['e5'] },
// { r: ['d5'] },
// // { r: ['a4'] },
// { l: ['f3', '4bc'], r: ['d4', 'd5'] },
// { r: ['e4', 'e5'] },
// // { r: ['f5'] },
// { l: ['cb4', 'd4', 'f4'], r: ['b4', 'b5'] },
// { r: ['f4', 'f5'] },
// { r: ['f4', 'f5'] },
// { l: ['b2'] },
// { l: ['f3', 'b3', 'e4'], r: ['f4', 'b4', 'e5'] },
// { r: ['f5'] },
// { r: ['e5'] },
// { l: ['d4'], r: ['d5'] },
// { r: ['b4'] },
// // Staff 5 (epic)
// { l: ['e1', 'e2'] },

// { l: ['f4', 'g4', 'b4'], r: ['f5', 'b5', 'f6'] },

// { l: ['e4', 'g4', 'b4'], r: ['e5', 'b5', 'e6'] },
// { l: ['e4', 'g4', 'b4'], r: ['e5', 'b5', 'e6'] },
// { l: ['e4', 'g4', 'b4'], r: ['e5', 'b5', 'e6'] },

// { l: ['d4', 'g4', 'b4'], r: ['d5', 'b5', 'd6'] },
// { l: ['d4', 'g4', 'b4'], r: ['d5', 'b5', 'd6'] },
// { l: ['d4', 'g4', 'b4'], r: ['d5', 'b5', 'd6'] },

// { l: ['c3', 'g4', 'b4'], r: ['c5', 'g5', 'b5', 'c6'] },
// { l: ['c3', 'g4', 'b4'], r: ['c5', 'g5', 'b5', 'c6'] },
// { l: ['c3', 'g4', 'b4'], r: ['c5', 'g5', 'b5', 'c6'] },

// { l: ['d4', 'g4', 'b4'], r: ['d5', 'b5', 'd6'] },

// { l: ['b3', 'd4', 'g4'], r: ['b4', 'g5', 'b5'] },

// { l: ['e1', 'e2', 'b2'] }
var translateNote = function translateNote(key, noteCode) {
  // DOESN'T HANDLE ACCIDENTALS

  var _$exec5 = /([a-g])([b#])?(\d)/.exec(noteCode);

  var _$exec6 = _slicedToArray(_$exec5, 4);

  var match = _$exec6[0];
  var note = _$exec6[1];
  var accidental = _$exec6[2];
  var octave = _$exec6[3];

  return [key[note], octave].join('');
};

var translateNoteSetToKey = function translateNoteSetToKey(key, noteSets) {
  var translateNoteToKey = _.partial(translateNote, key);
  return noteSets.map(function (noteSet) {
    return _.mapValues(noteSet, function (notes) {
      return notes.map(translateNoteToKey);
    });
  });
};

var dbM = {
  d: 'db',
  e: 'eb',
  f: 'f',
  g: 'gb',
  a: 'ab',
  b: 'bb',
  c: 'c'
};

// console.table(translateNoteSetToKey(dbM, claireDeLune))

$(function () {
  start(translateNoteSetToKey(dbM, claireDeLune), { mode: 'sequence' });
});

// if (require.main === module) {
//   const test = require('tape')

//   test('display notes', t => {
//     let testCases = [
//       ['3a', 230, { hand: 'l' }],
//     ]

//     t.plan(testCases.length)
//     testCases.forEach(([note, expectedPlacement, { hand }]) => {
//       t.equals(appendNote(hand, LEFT_HAND_MIDDLE_C_TOP, note), expectedPlacement)
//     })
//   })
// }
// watch "clear && date && babel-node index.js"

//# sourceMappingURL=index-compiled.js.map