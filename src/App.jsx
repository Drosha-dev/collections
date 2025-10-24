
import React from 'react'
import './App.css'
import Note from '../components/note.jsx'
import { useState, useEffect } from 'react'
import noteService from "./services/notes.js"


const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {

    noteService.getAll().then(response => {
      setNotes(response.data)
    })
  
  },[])


  const toggleImportanceOf = (id) => {
    
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(id,changedNote).then(response => {
      setNotes(notes.map(note => note.id === id ? response.data : note))
    })
  }

  const handleNoteChange = (e) => {

    setNewNote(e.target.value);
  }

  const addNote = (e) => {
    e.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < .5,
    }

    noteService.create(noteObject).then(response => {
      setNotes(notes.concat(response.data))
      setNewNote('')
    })

  }


  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {
          notesToShow.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />)
        }
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote}
          onChange={handleNoteChange}
        />
        <button type='submit'>save</button>
      </form>
    </>
  )
}

export default App
