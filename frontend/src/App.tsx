import { useState, useEffect } from 'react'
import { NoteService } from './services/noteService'
import type { Note } from './services/noteService'
import './App.css'

/**
 * Main application component for the Notes App
 * Handles all note operations including CRUD and archiving
 */
function App() {
  // State for managing notes and UI
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  
  // State for note editing
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [editForm, setEditForm] = useState({ title: '', content: '' })
  
  // State for view mode (active/archived)
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active')

  // Load notes when component mounts
  useEffect(() => {
    loadNotes()
  }, [viewMode])

  /**
   * Load notes based on current view mode
   */
  const loadNotes = async () => {
    try {
      setLoading(true)
      const notesData = viewMode === 'active' 
        ? await NoteService.getActiveNotes()
        : await NoteService.getArchivedNotes()
      setNotes(notesData)
      setError(null)
    } catch (err) {
      setError('Error al cargar las notas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle form submission for creating a new note
   * @param e Form submission event
   */
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.title.trim() || !newNote.content.trim()) return

    try {
      await NoteService.createNote(newNote)
      setNewNote({ title: '', content: '' })
      setError(null)
      // Reload notes to show the new one
      await loadNotes()
    } catch (err) {
      setError('Error al crear la nota')
      console.error(err)
    }
  }

  /**
   * Start editing a note
   * @param note Note to edit
   */
  const handleStartEdit = (note: Note) => {
    setEditingNote(note)
    setEditForm({ title: note.title, content: note.content })
  }

  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingNote(null)
    setEditForm({ title: '', content: '' })
  }

  /**
   * Save edited note
   */
  const handleSaveEdit = async () => {
    if (!editingNote || !editForm.title.trim() || !editForm.content.trim()) return

    try {
      await NoteService.updateNote(editingNote.id, editForm)
      setEditingNote(null)
      setEditForm({ title: '', content: '' })
      setError(null)
      // Reload notes to show the updated one
      await loadNotes()
    } catch (err) {
      setError('Error al actualizar la nota')
      console.error(err)
    }
  }

  /**
   * Toggle archive status of a note
   * @param id Note ID to toggle archive status
   */
  const handleToggleArchive = async (id: number) => {
    try {
      await NoteService.toggleArchive(id)
      setError(null)
      await loadNotes() //  Refresh the list so that the note moves from active to archived or vice versa
    } catch (err) {
      setError('Error al archivar/desarchivar la nota')
      console.error(err)
    }
  }
  

  /**
   * Delete a note by ID
   * @param id Note ID to delete
   */
  const handleDeleteNote = async (id: number) => {
    try {
      await NoteService.deleteNote(id)
      setError(null)
      // Reload notes to remove the deleted one
      await loadNotes()
    } catch (err) {
      setError('Error al eliminar la nota')
      console.error(err)
    }
  }

  /**
   * Switch between active and archived notes view
   * @param mode View mode to switch to
   */
  const handleViewModeChange = (mode: 'active' | 'archived') => {
    setViewMode(mode)
  }

  // Show loading state
  if (loading) {
    return <div className="app">Cargando notas...</div>
  }

  return (
    <div className="app">
      <h1>App de Notas</h1>
      
      {/* Error message display */}
      {error && <div className="error">{error}</div>}

      {/* View mode selector */}
      <div className="view-mode-selector">
        <button 
          onClick={() => handleViewModeChange('active')}
          className={viewMode === 'active' ? 'active' : ''}
        >
          Notas Activas
        </button>
        <button 
          onClick={() => handleViewModeChange('archived')}
          className={viewMode === 'archived' ? 'active' : ''}
        >
          Notas Archivadas
        </button>
      </div>

      {/* Note creation form */}
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

      {/* Notes list section */}
      <div className="notes-section">
        <h2>{viewMode === 'active' ? 'Notas Activas' : 'Notas Archivadas'} ({notes.length})</h2>
        {notes.length === 0 ? (
          <p>No hay {viewMode === 'active' ? 'notas activas' : 'notas archivadas'}</p>
        ) : (
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className={`note ${note.archived ? 'archived' : ''}`}>
                {editingNote?.id === note.id ? (
                  // Edit mode
                  <div className="note-edit-mode">
                    <input
                      type="text"
                      placeholder="Título"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="edit-title"
                    />
                    <textarea
                      placeholder="Contenido"
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      className="edit-content"
                    />
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="save-edit">
                        Guardar
                      </button>
                      <button onClick={handleCancelEdit} className="cancel-edit">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    {/* Note metadata */}
                    <div className="note-meta">
                      <span>ID: {note.id}</span>
                      <span>Archivada: {note.archived ? 'Sí' : 'No'}</span>
                      <span>Creada: {new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* Note action buttons */}
                    <div className="note-actions">
                      <button onClick={() => handleStartEdit(note)} className="edit">
                        Editar
                      </button>
                      <button onClick={() => handleToggleArchive(note.id)}>
                        {note.archived ? 'Desarchivar' : 'Archivar'}
                      </button>
                      <button onClick={() => handleDeleteNote(note.id)} className="delete">
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
