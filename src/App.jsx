
import React from 'react'
import './App.css'
import Note from '../components/note.jsx'
import axios from 'axios'
import { useState,useEffect } from 'react'


const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('') 
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect');
    axios
      .get('http://localhost:3002/notes')
      .then(response => {
        console.log('promised fulfilled');
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes');
  

  const handleNoteChange = (e) => {
   
    setNewNote(e.target.value);
  }

  const addNote = (e) => {
    e.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < .5,
      id: String(notes.length + 1)
    }
    setNotes(notes.concat(noteObject))
    setNewNote('')
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
          notesToShow.map(note => <Note key={note.id} note={note} />)
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
