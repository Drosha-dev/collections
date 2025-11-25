
import React from 'react'
import './App.css'
import Note from '../components/note.jsx'
import { useState, useEffect } from 'react'
import noteService from "./services/notes.js"
import Notification from '../components/error.jsx'
import Footer from '../components/Footer.jsx'



const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')


  useEffect(() => {

    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])


  const addNote = (e) => {
    e.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < .5,
    }

    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })

  }


  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => (note.id !== id ? note : returnedNote)))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleNoteChange = event => {
    setNewNote(event.target.value)
  }



  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <>
      <div>
        <h1>Notes</h1>
        {errorMessage && <Notification message={errorMessage} />}
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
        <Footer />
      </div>
    </>
  )
}

export default App
