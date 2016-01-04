// import _ from 'lodash'
// import $ from 'jquery'

const EQUIVALENTS = {
  db: 'c#',
  eb: 'd#',
  fb: 'e',
  gb: 'f#',
  ab: 'g#',
  bb: 'a#',
  cb: 'b'
}

let notesHistory = []
let cursor = -1
let notesToPractice = 50
let notesLeft = notesToPractice
let errors = 0
let startTime

const KEYS = {
  A: 65,
  B: 66,
  F: 70,
  SPACE: 32
}

const previousNotes = () => {
  cursor = Math.max(cursor - 1, 0)
  display(notesHistory[cursor])
}

const nextNotes = (toPractice, { mode }) => {
  let notes
  if (mode === 'sequence') {
    notes = toPractice.shift()
  } else {
    notes = _.sample(toPractice)
  }
  notesHistory.push(notes)
  cursor += 1
  display(notesHistory[cursor])
}

const playNotes = () => {
  _.values(notesHistory[cursor]).forEach(note => {
    if (EQUIVALENTS[note.slice(1)]) {
      note = note[0] + EQUIVALENTS[note.slice(1)]
    }
    console.log('playing', note)
    // new Audio('./pianonotes/' + note + '.mp3').play()
  })
}

const display = notes => {
  $('.note').remove()
  $('.current-notes').text('')

  if (notes.l) _.each(notes.l, appendLeftHandNote)
  if (notes.r) _.each(notes.r, appendRightHandNote)
}

const STEP = 19.75
const RIGHT_HAND_MIDDLE_C_TOP = 235.5
const LEFT_HAND_MIDDLE_C_TOP = 366
const MIDDLE_C_MIDI_KEY_CODE = 60
const NOTE_OFFSETS = {
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
}

// midiKeyCodes: int. MIDI code for piano keys.
// but i need to figure out which are left or right hand.

// noteCodes: str. Human-friendly way to transcribe music. Key aware.
// good for displaying, because i only need the note for the placement and the accidental for decoration
// Format: note (abcdefg), accidental (#, b, or n), octave (1-8), fingering (int).

const noteCodeToMidiKeyCode = noteCode => {
  const [ match, note, accidental, octave ] = /([a-g])([b#])?(\d)/.exec(noteCode)
  return MIDDLE_C_MIDI_KEY_CODE + ((octave - 4) * 12) + NOTE_OFFSETS[[note, accidental].join('')]
}

const midiKeyCodeToNoteCode = midiKeyCode => {
  const note = _.invert(NOTE_OFFSETS)[midiKeyCode % 12]
  const octave = Math.floor(midiKeyCode / 12) - 1
  return note + octave
}

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

const WHITE_KEY_NOTE_OFFSETS = {
  c: 0,
  d: 1,
  e: 2,
  f: 3,
  g: 4,
  a: 5,
  b: 6
}
const getNoteCodeTop = (noteCode, hand) => {
  const [ match, note, accidental, octave ] = /([a-g])([b#])?(\d)/.exec(noteCode)
  const steps = ((octave - 4) * 7) + WHITE_KEY_NOTE_OFFSETS[note]
  const pxFromMiddleC = steps * -STEP
  switch (hand) {
    case 'l': return pxFromMiddleC + LEFT_HAND_MIDDLE_C_TOP
    case 'r': return pxFromMiddleC + RIGHT_HAND_MIDDLE_C_TOP
  }
}

// console.log(getNoteCodeTop(103, 'r'), 103, 'r')
// console.log(getNoteCodeTop('c4', 'r'), 'c4', 'r')
// console.log(getNoteCodeTop('d4', 'r'), 'd4', 'r')
// console.log(getNoteCodeTop(103, 'l'), 103, 'l')
// console.log(getNoteCodeTop(60, 'l'), 60, 'l')
// console.log(getNoteCodeTop(28, 'l'), 28, 'l')

const appendNote = (hand, noteCode) => {
  // const midiKeyCode = noteCodeToMidiKeyCode(noteCode)
  const top = getNoteCodeTop(noteCode, hand)
  $('.staff-container').append(`<div style="top: ${top}px" class="note" id="${noteCode}"></div>`)
}

const appendLeftHandNote = _.partial(appendNote, 'l')
const appendRightHandNote = _.partial(appendNote, 'r')

const revealNotes = () => {
  $('.current-notes').text(stringifyNotes(notesHistory[cursor]))
}

const stringifyNotes = ({ r, l }) => {
  let leftHand, rightHand
  if (l) leftHand = 'l: ' + l.join(', ')
  if (r) rightHand = 'r: ' + r.join(', ')
  return _.compact([leftHand, rightHand]).join(', ')
}

const reportError = () => {
  errors += 1
  const notesPlayed = notesToPractice - notesLeft
  const score = 100.0 * (notesPlayed - errors) / notesPlayed
  $('.progress').text('Score: ' + score + '%. Time: ' + timeToPlay.toFixed(1) + ' seconds')
}

const updateProgress = () => {
  notesLeft -= 1
  const notesPlayed = notesToPractice - notesLeft
  const score = 100.0 * (notesPlayed - errors) / notesPlayed
  if (notesLeft === 0) {
    const timeToPlay = (Date.now() - startTime) / 1000.0
    $('.progress').text('Score: ' + score + '%. Time: ' + timeToPlay.toFixed(1) + ' seconds')
    document.onkeyup = null
  } else {
    $('.progress').text(notesLeft + ' left! Score: ' + score.toFixed(1) + '%')
  }
}

let currentCorrectNotes = 0
let currentIncorrectNotes = 0

const onMidiMessage = (correctCallback, incorrectCallback, msg) => {
  const [eventType, midiKeyCode, velocity] = msg.data
  const currentNotes = _.flatten(_.values(notesHistory[cursor]))
  const noteCode = midiKeyCodeToNoteCode(midiKeyCode)

  if (_.contains(currentNotes, noteCode)) {
    if (velocity) {
      currentCorrectNotes += 1
      $('#' + noteCode).css({ borderColor: 'green' })
    } else {
      currentCorrectNotes = Math.max(currentCorrectNotes - 1, 0)
      $('#' + noteCode).css({ borderColor: 'black' })
    }
  } else {
    if (velocity) {
      // determine hand by looking at current notes. which hand is it closer to? if only one, choose that one.
      appendNote(determineHandAttempt(noteCode), noteCode)
      currentIncorrectNotes += 1
      $('#' + noteCode).css({ borderColor: 'red' })
    } else {
      currentIncorrectNotes = Math.max(currentIncorrectNotes - 1, 0)
      $('#' + noteCode).remove()
    }
  }

  if (currentCorrectNotes === currentNotes.length && !currentIncorrectNotes) {
    currentCorrectNotes = 0
    currentIncorrectNotes = 0
    correctCallback()
  } else if (currentIncorrectNotes) {
    console.log(currentNotes, currentCorrectNotes, currentIncorrectNotes)
    incorrectCallback()
  }
}

const determineHandAttempt = noteCode => {
  const badNote = noteCodeToMidiKeyCode(noteCode)
  const currentNotes = notesHistory[cursor]
  if (!currentNotes.l) return 'r'
  if (!currentNotes.r) return 'l'

  const highestLeftHandNote = Math.max(...currentNotes.l.map(noteCodeToMidiKeyCode))
  const lowestRightHandNote = Math.min(...currentNotes.r.map(noteCodeToMidiKeyCode))
  const closerToLeft = Math.abs(badNote - highestLeftHandNote) < Math.abs(badNote - lowestRightHandNote)
  return closerToLeft ? 'l' : 'r'
}

const start = (toPractice, options) => {
  startTime = Date.now()
  const customizedNextNotes = nextNotes.bind(null, toPractice, options)

  document.onkeyup = e => {
    switch (e.which) {
      case KEYS.A: {
        previousNotes()
        break
      }
      case KEYS.F: {
        break
      }
      case KEYS.B: {
        break
      }
      case KEYS.SPACE: {
        revealNotes()
        playNotes()
        break
      }
    }
  }

  const success = () => {
    updateProgress()
    customizedNextNotes()
  }

  const error = () => {
    console.log('error')
  }

  const onMIDISuccess = midiAccess => {
    var inputs = midiAccess.inputs.values()
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = _.partial(onMidiMessage, success, error)
    }
  }

  navigator.requestMIDIAccess().then(onMIDISuccess);
  customizedNextNotes()
}

// const nest = any => [any]
// const dFlatMinor = ['dFlat', 'eFlat', 'f', 'gFlat', 'aFlat', 'bFlat', 'c']
// const dFlatMinorNotes = dFlatMinor.map(note => '4' + note).concat(dFlatMinor.map(note => '3' + note)).map(nest)
// const dFlatMinorTrebleClef = dFlatMinor.map(note => ['4' + note]).concat([['3c'], ['3dFlat'], ['3eFlat'], ['3f'], ['3gFlat']])
// const notesIKeepFuckingUp = ['4f', '4dFlat', '4aFlat', '3eFlat', '3dFlat'].map(nest)

const claireDeLune = [
  // Staff 3
  { l: ['f3', 'a3'], r: ['b3', 'e4'] },
  { r: ['d4'] },
  { r: ['e4'] },
  { r: ['d4'] },
  { l: ['e3', 'g3'], r: ['a3', 'c4'] },
  { l: ['a2'] },
  { l: ['d2', 'a2'] },
  { r: ['a3', 'f3'] },
  { l: ['a2', 'c3'] },
  { r: ['f5', 'a5'] },
  { r: ['d5', 'f5'] },
  { l: ['g2', 'd3'] },
  { l: ['d3', 'g3', 'b3', 'd4'], r: ['g4', 'b4', 'e5'] },
  { r: ['f5'] },
  { r: ['e5'] },
  { l: ['g2', 'd3'] },
  // { r: ['a4'] },
  { l: ['f3', 'a3'], r: ['d4', 'd5'] },
  { r: ['d4', 'd5'] },
  { l: ['d4', 'f4'], r: ['a4', 'd5', 'a5'] },
  { l: ['a3', 'd4'], r: ['f4', 'd5', 'g5'] },
  // Staff 4
  { l: ['g2', 'd3'], r: ['f5'] },
  { l: ['d3', 'g3', 'b3', 'd4'], r: ['g4', 'b4', 'e5'] },
  { r: ['f5'] },
  { r: ['e5'] },
  { r: ['d5'] },
  // { r: ['a4'] },
  { l: ['f3', 'cb4'], r: ['d4', 'd5'] },
  { r: ['e4', 'e5'] },
  // { r: ['f5'] },
  { l: ['cb4', 'd4', 'f4'], r: ['b4', 'b5'] },
  { r: ['f4', 'f5'] },
  { r: ['f4', 'f5'] },
  { l: ['b2'] },
  { l: ['f3', 'b3', 'e4'], r: ['f4', 'b4', 'e5'] },
  { r: ['f5'] },
  { r: ['e5'] },
  { l: ['d4'], r: ['d5'] },
  { r: ['b4'] },
  // Staff 5 (epic)
  { l: ['e1', 'e2'] },

  { l: ['f4', 'g4', 'b4'], r: ['f5', 'b5', 'f6'] },

  { l: ['e4', 'g4', 'b4'], r: ['e5', 'b5', 'e6'] },
  { l: ['e4', 'g4', 'b4'], r: ['e5', 'b5', 'e6'] },
  { l: ['e4', 'g4', 'b4'], r: ['e5', 'b5', 'e6'] },

  { l: ['d4', 'g4', 'b4'], r: ['d5', 'b5', 'd6'] },
  { l: ['d4', 'g4', 'b4'], r: ['d5', 'b5', 'd6'] },
  { l: ['d4', 'g4', 'b4'], r: ['d5', 'b5', 'd6'] },

  { l: ['c3', 'g4', 'b4'], r: ['c5', 'g5', 'b5', 'c6'] },
  { l: ['c3', 'g4', 'b4'], r: ['c5', 'g5', 'b5', 'c6'] },
  { l: ['c3', 'g4', 'b4'], r: ['c5', 'g5', 'b5', 'c6'] },

  { l: ['d4', 'g4', 'b4'], r: ['d5', 'b5', 'd6'] },

  { l: ['b3', 'd4', 'g4'], r: ['b4', 'g5', 'b5'] },

  { l: ['e2', 'b2'] }
]

const translateNote = (key, noteCode) => {
  // DOESN'T HANDLE ACCIDENTALS
  const [ match, note, accidental, octave ] = /([a-g])([b#])?(\d)/.exec(noteCode)
  return [key[note], octave].join('')
}

const translateNoteSetToKey = (key, noteSets) => {
  const translateNoteToKey = _.partial(translateNote, key)
  return noteSets.map(noteSet => {
    return _.mapValues(noteSet, notes => notes.map(translateNoteToKey))
  })
}

const dbM = {
  d: 'db',
  e: 'eb',
  f: 'f',
  g: 'gb',
  a: 'ab',
  b: 'bb',
  c: 'c'
}

// console.table(translateNoteSetToKey(dbM, claireDeLune))

$(() => start(translateNoteSetToKey(dbM, claireDeLune), { mode: 'sequence' }))

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
