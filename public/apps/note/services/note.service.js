// Notes service


import { loadFromStorage, saveToStorage, makeId } from '../../../services/util.service.js'
import { storageService } from '../../../services/async-storage.service.js'
const NOTES_KEY = 'notesDB'
_createNotes()

export const noteService = {
  query,
  get,
  remove,
  save,
  getEmptyNote,
  getDefaultFilter,
  getFilterFromSearchParams,
  put,
  post,
}

// ~~~~~~~~~~~~~~~~FUNCTIONS~~~~~~~~~~~~~~~~~~~
// to do
function query(filterBy = { txt: '' }) {
  return storageService.query(NOTES_KEY)
    .then(notes => {
      notes.sort((a, b) => (b.isPinned === true) - (a.isPinned === true))

      if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        notes.filter(note =>
          regExp.test(note.type) ||
          regExp.test(note.info.txt || '') ||
          regExp.test(note.info.title || '')
        )
      }

      if (filterBy.status) {
        switch (filterBy.status) {
          case "main":
            break
          case "texts":
            notes = notes.filter(note => note.type === 'NoteTxt'
            )
            break
          case "images":
            notes = notes.filter(note => note.type === 'NoteImg'
            )
            break
          case "todos":
            notes = notes.filter(note => note.type === 'NoteTodos'
            )
            break
        }
      }
      return notes

    })
}
function post(noteId) {
  return storageService.post(NOTES_KEY, noteId)

}

function put(noteId) {
  return storageService.put(NOTES_KEY, noteId)
}

function get(noteId) {
  return storageService.get(NOTES_KEY, noteId)
}

function remove(noteId) {
  // return Promise.reject('Oh No!')
  return storageService.remove(NOTES_KEY, noteId)
}

function save(note) {
  if (note.id) {
    return storageService.put(NOTES_KEY, note)
  } else {
    return storageService.post(NOTES_KEY, note)
  }
}

// to do 
// לשנות מה שלי יש בדיפולט פילטר
function getFilterFromSearchParams(searchParams) {
  const txt = searchParams.get('txt') || ''
  const addNoteType = searchParams.get('addNoteType') || 'collapsed'
  const status = searchParams.get('status') || ''
  // const status = searchParams.get('state') || ''
  // const lables = searchParams.get('lables') || ''

  return {
    txt,
    addNoteType,
    status,
    // lables
  }
}


function getDefaultFilter(filterBy = { txt: '' }) {
  return { isPinned: filterBy.isPinned, info: filterBy.info, type: filterBy.type, createdAt: filterBy.createdAt }

}
// function getDefaultFilter(filterBy = { isPinned: true, info: '', type: null, createdAt: null }) {
//     return { isPinned: filterBy.isPinned, info: filterBy.info, type: filterBy.type, createdAt: filterBy.createdAt }

// }



function getEmptyNote(type = 'NoteTxt') {
  const note = {
    id: '',
    createdAt: Date.now(),
    type,
    isPinned: false,
    style: { backgroundColor: '#ffffff' },
    info: {}
  }

  switch (type) {
    case 'NoteTxt':
      note.info = {
        title: ''
        , txt: ''
      }
      break

    case 'NoteImg':
      note.info = {
        url: '',
        title: ''
      }
      break

    case 'NoteTodos':
      note.info = {
        title: '',
        todos: [
          { txt: '', doneAt: null }
        ]
      }
      break

    default:
      throw new Error(`Unknown note type: ${type}`)
  }
  return note

}





// ~~~~~~~~~~~~~~~~LOCAL FUNCTIONS~~~~~~~~~~~~~~~~~~~

function _createNotes() {
  const notes = loadFromStorage(NOTES_KEY) || []
  if (notes.length === 0) {
    saveToStorage(NOTES_KEY, _createDemoNotes())
  }

}


// Generates 10 demo notes (2 long text notes ≥100 words)
function _createDemoNotes() {
  const now = Date.now()

  return [
    // 1 – long text (~120 words)
    {
      id: makeId(4),
      createdAt: now,
      type: 'NoteTxt',
      isPinned: true,
      style: { backgroundColor: '#ffd58a' },
      info: {
        txt: `The morning began with a light jog around the park. The sky was
          cloud‑dotted, cool enough to feel fresh without a jacket. I passed the
          lake and heard ducks splashing near the reeds. After the run I stopped
          at a tiny corner café that’s been open since the nineties, ordered a
          strong Americano and a cheese toastie, and watched people greet the
          owner by first name. On my commute I listened to a radio story about a
          neighbor who grows tomatoes on his rooftop and gives them away on
          Sundays. It made me think about how small gestures change an entire
          street’s mood. Work was busy—stand‑ups, stubborn bugs, sprint planning—
          but a surprise chocolate‑cake birthday at noon melted the stress. I
          left the office with a pink sunset overhead and a new novel waiting at
          home.`
      }
    },

    // 2 – image note
    {
      id: makeId(4),
      createdAt: now + 1,
      type: 'NoteImg',
      isPinned: false,
      style: { backgroundColor: '#e0f7fa' },
      info: {
        url: "./assets/img/note/aps,504x498,medium,transparent-pad,600x600,f8f8f8.jpg",
        title: 'logo to Aqua-Web'
      }
    },

    // 3 – todo list
    {
      id: makeId(4),
      createdAt: now + 2,
      type: 'NoteTodos',
      isPinned: false,
      info: {
        title: 'Weekend tasks',
        todos: [
          { txt: 'Clean wardrobe', doneAt: null },
          { txt: 'Buy veggies for dinner', doneAt: null },
          { txt: 'Call Grandma', doneAt: 187111111 }
        ]
      }
    },

    // 4 – short text
    {
      id: makeId(4),
      createdAt: now + 3,
      type: 'NoteTxt',
      isPinned: false,
      style: { backgroundColor: '#f8bbd0' },
      info: { txt: 'Pick up the package from the post office before 8 PM' }
    },

    // 5 – inspirational image
    {
      id: makeId(4),
      createdAt: now + 4,
      type: 'NoteImg',
      isPinned: true,
      style: { backgroundColor: '#dcedc8' },
      info: {
        url: 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15676/p3-hiking-hl1024-gi1680305131.jpg',
        title: 'Next hiking spot'
      }
    },

    // 6 – another long text note (~110 words)
    {
      id: makeId(4),
      createdAt: now + 5,
      type: 'NoteTxt',
      isPinned: false,
      style: { backgroundColor: '#d1c4e9' },
      info: {
        txt: `Monday morning I swapped my usual drive for a train ride. On the
          platform I bumped into an old university friend I hadn’t seen in
          years. We laughed about nights we lived on instant noodles and how now
          we debate specialty coffee and pension plans. The ride flew by, and he
          promised to email a hilarious boot‑camp photo from 2010. That random
          encounter reminded me that people drift out and back into our lives,
          adding unexpected color like a pop‑up art show on an empty wall.`
      }
    },

    // 7 – grocery list
    {
      id: makeId(4),
      createdAt: now + 6,
      type: 'NoteTodos',
      isPinned: false,
      info: {
        title: 'Grocery run',
        todos: [
          { txt: 'Almond milk', doneAt: null },
          { txt: 'Brown rice', doneAt: null },
          { txt: 'Ground coffee', doneAt: null }
        ]
      }
    },

    // 8 – meeting reminder
    {
      id: makeId(4),
      createdAt: now + 7,
      type: 'NoteTxt',
      isPinned: true,
      style: { backgroundColor: '#fff59d' },
      info: { txt: 'Wednesday 14:30 – mortgage consultant meeting' }
    },

    // 9 – dinner photo
    {
      id: makeId(4),
      createdAt: now + 8,
      type: 'NoteImg',
      isPinned: false,
      style: { backgroundColor: '#ffe0b2' },
      info: {
        url: 'https://myplate-prod.azureedge.us/sites/default/files/styles/recipe_525_x_350_/public/2020-11/SkilletPastaDinner_527x323.jpg?itok=Yb4EDdkm',
        title: 'Experimental dinner'
      }
    },

    // 10 – medium text idea
    {
      id: makeId(4),
      createdAt: now + 9,
      type: 'NoteTxt',
      isPinned: false,
      style: { backgroundColor: '#c8e6c9' },
      info: {
        txt: 'Blog post idea: balancing full‑time work with evening studies without sacrificing downtime.'
      }
    }
  ]
}




// function _setNextPrevnoteId(note) {
//     return query().then((Notes) => {
//         const NoteIdx = Notes.findIndex((currNote) => currNote.id === note.id)
//         const nextNote = Notes[NoteIdx + 1] ? Notes[NoteIdx + 1] : Notes[0]
//         const prevNote = Notes[NoteIdx - 1] ? Notes[NoteIdx - 1] : Notes[Notes.length - 1]
//         Note.nextNoteId = nextNote.id
//         Note.prevNoteId = prevNote.id
//         return Note
//     })
// }
