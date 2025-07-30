import { useState, useEffect } from 'react'
import { NoteService } from './services/noteService'
import type { Note } from './services/noteService'
import './App.css'

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newNote, setNewNote] = useState({ title: '', content: '' })

  // Cargar notas al montar el componente
  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      setLoading(true)
      const allNotes = await NoteService.getAllNotes()
      setNotes(allNotes)
      setError(null)
    } catch (err) {
      setError('Error al cargar las notas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.title.trim() || !newNote.content.trim()) return

    try {
      const createdNote = await NoteService.createNote(newNote)
      setNotes([createdNote, ...notes])
      setNewNote({ title: '', content: '' })
      setError(null)
    } catch (err) {
      setError('Error al crear la nota')
      console.error(err)
    }
  }

  const handleToggleArchive = async (id: number) => {
    try {
      const updatedNote = await NoteService.toggleArchive(id)
      setNotes(notes.map(note => note.id === id ? updatedNote : note))
      setError(null)
    } catch (err) {
      setError('Error al archivar/desarchivar la nota')
      console.error(err)
    }
  }

  const handleDeleteNote = async (id: number) => {
    try {
      await NoteService.deleteNote(id)
      setNotes(notes.filter(note => note.id !== id))
      setError(null)
    } catch (err) {
      setError('Error al eliminar la nota')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="app">Cargando notas...</div>
  }

  return (
    <div className="app">
      <h1>App de Notas</h1>
      
      {error && <div className="error">{error}</div>}

      {/* Formulario para crear nota */}
      <form onSubmit={handleCreateNote} className="note-form">
        <h2>Crear Nueva Nota</h2>
        <input
          type="text"
          placeholder="Título"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Contenido"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          required
        />
        <button type="submit">Crear Nota</button>
      </form>

      {/* Lista de notas */}
      <div className="notes-section">
        <h2>Notas ({notes.length})</h2>
        {notes.length === 0 ? (
          <p>No hay notas</p>
        ) : (
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className={`note ${note.archived ? 'archived' : ''}`}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <div className="note-meta">
                  <span>ID: {note.id}</span>
                  <span>Archivada: {note.archived ? 'Sí' : 'No'}</span>
                  <span>Creada: {new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="note-actions">
                  <button onClick={() => handleToggleArchive(note.id)}>
                    {note.archived ? 'Desarchivar' : 'Archivar'}
                  </button>
                  <button onClick={() => handleDeleteNote(note.id)} className="delete">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
