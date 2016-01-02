
var EQUIVALENTS = {
  dFlat: 'cSharp',
  eFlat: 'dSharp',
  fFlat: 'e',
  gFlat: 'fSharp',
  aFlat: 'gSharp',
  bFlat: 'aSharp',
  cFlat: 'b'
}

var notesHistory = []
var cursor = -1
var notesToPractice = 10
var notesLeft = notesToPractice
var errors = 0
var startTime

KEYS = {
  A: 97,
  B: 98,
  F: 102,
  SPACE: 32
}

var previousNotes = () => {
  cursor = Math.max(cursor - 1, 0)
  display(notesHistory[cursor])
}

var nextNotes = toPractice => {
  var notes = _.sample(toPractice)
  notesHistory.push(notes)
  cursor += 1
  display(notesHistory[cursor])
}

var playNotes = () => {
  notesHistory[cursor].forEach(note => {
    if (EQUIVALENTS[note.slice(1)]) {
      note = note[0] + EQUIVALENTS[note.slice(1)]
    }
    console.log(note)
    new Audio('./pianonotes/' + note + '.mp3').play()
  })
}

var display = notes => {
  $('.note').remove()
  $('.current-notes').text('')
  _.each(notes, appendNote)
}

var appendNote = noteName => {
  if (noteName.endsWith('Flat') || noteName.endsWith('Sharp')) {
    noteName = noteName.slice(0, -4)
  }

  $('.staff-container').append('<div class="note _' + noteName + '" />')
}

var revealNotes = () => {
  $('.current-notes').text(notesHistory[cursor].join(', '))
}

var reportError = () => {
  errors += 1
}

var updateProgress = () => {
  notesLeft -= 1
  var notesPlayed = notesToPractice - notesLeft
  var score = 100.0 * (notesPlayed - errors) / notesPlayed
  if (notesLeft === 0) {
    var timeToPlay = (Date.now() - startTime) / 1000.0
    $('.progress').text('Score: ' + score + '%. Time: ' + timeToPlay.toFixed(1) + ' seconds')
    document.onkeypress = null
  } else {
    $('.progress').text(notesLeft + ' left! Score: ' + score.toFixed(1) + '%')
  }
}

var start = toPractice => {
  startTime = Date.now()
  document.onkeypress = e => {
    console.log(e.which)
    switch (e.which) {
      case KEYS.A: {
        previousNotes()
        break
      }
      case KEYS.F: {
        updateProgress()
        nextNotes(toPractice)
        break
      }
      case KEYS.B: {
        reportError()
        updateProgress()
        nextNotes(toPractice)
        break
      }
      case KEYS.SPACE: {
        revealNotes()
        playNotes()
        break
      }
    }
  }

  nextNotes(toPractice)
}

var nest = any => [any]
var dFlatMinor = ['dFlat', 'eFlat', 'f', 'gFlat', 'aFlat', 'bFlat', 'c']

var dFlatMinorNotes = dFlatMinor.map(note => '4' + note).concat(dFlatMinor.map(note => '3' + note)).map(nest)
var dFlatMinorTrebleClef = dFlatMinor.map(note => ['4' + note]).concat([['3c'], ['3dFlat'], ['3eFlat'], ['3f'], ['3gFlat']])
var notesIKeepFuckingUp = ['4f', '4dFlat', '4aFlat', '3eFlat', '3dFlat'].map(nest)

var claireDeLuneChords = [
  ['3f', '4aFlat']
]

$(() => start(dFlatMinorTrebleClef))
