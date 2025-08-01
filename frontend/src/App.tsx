import { useState, useEffect } from 'react'
import { NoteService } from './services/noteService'
import type { Note, Category } from './services/noteService'
import { CategoryFilter } from './components/CategoryFilter'
import { CategorySelector } from './components/CategorySelector'
import { CategoryTags } from './components/CategoryTags'
import './App.css'

/**
 * Main application component for the Notes App
 * Handles all note operations including CRUD and archiving
 */
function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [editForm, setEditForm] = useState({ title: '', content: '' })
  const [viewMode, setViewMode] = useState<'active' | 'archived'>('active')
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedCategoriesForNote, setSelectedCategoriesForNote] = useState<number[]>([])

  useEffect(() => {
    loadNotes()
    loadCategories()
  }, [viewMode, selectedCategory])

  const loadNotes = async () => {
    try {
      setLoading(true)
      let notesData: Note[]
      if (selectedCategory) {
        notesData = await NoteService.getNotesByCategory(selectedCategory, viewMode === 'archived')
      } else {
        notesData = viewMode === 'active' 
          ? await NoteService.getActiveNotes()
          : await NoteService.getArchivedNotes()
      }
      setNotes(notesData)
      setError(null)
    } catch (err) {
      setError('Failed to load notes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const categoriesData = await NoteService.getAllCategories()
      setCategories(categoriesData)
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.title.trim() || !newNote.content.trim()) return
    try {
      const createdNote = await NoteService.createNote(newNote)
      setNewNote({ title: '', content: '' })
      setSelectedCategoriesForNote([])
      setError(null)
      if (selectedCategoriesForNote.length > 0) {
        await handleAssignCategories(createdNote.id, selectedCategoriesForNote)
      } else {
        const noteWithCategories = { ...createdNote, categories: [] }
        setNotes(prevNotes => [...prevNotes, noteWithCategories])
      }
    } catch (err) {
      setError('Failed to create note')
      console.error(err)
    }
  }

  const handleStartEdit = (note: Note) => {
    setEditingNote(note)
    setEditForm({ title: note.title, content: note.content })
    setSelectedCategoriesForNote(note.categories?.map(cat => cat.id) || [])
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
    setEditForm({ title: '', content: '' })
    setSelectedCategoriesForNote([])
  }

  const handleSaveEdit = async () => {
    if (!editingNote || !editForm.title.trim() || !editForm.content.trim()) return
    try {
      const updatedNote = await NoteService.updateNote(editingNote.id, editForm)
      setNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === editingNote.id ? { ...n, ...editForm } : n
        )
      )
      if (selectedCategoriesForNote.length > 0) {
        await handleAssignCategories(editingNote.id, selectedCategoriesForNote)
      }
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === editingNote.id 
            ? { ...updatedNote, categories: note.categories } 
            : note
        )
      )
      setEditingNote(null)
      setEditForm({ title: '', content: '' })
      setSelectedCategoriesForNote([])
      setError(null)
    } catch (err) {
      setError('Failed to update note')
      console.error(err)
    }
  }

  const handleToggleArchive = async (id: number) => {
    try {
      const updatedNote = await NoteService.toggleArchive(id)
      setError(null)
      setNotes(prevNotes =>
        prevNotes.filter(note => note.id !== id)
      )
      if (
        (updatedNote.archived && viewMode === 'archived') ||
        (!updatedNote.archived && viewMode === 'active')
      ) {
        setNotes(prevNotes => [...prevNotes, updatedNote])
      }
    } catch (err) {
      setError('Failed to toggle archive status')
      console.error(err)
    }
  }

  const handleDeleteNote = async (id: number) => {
    try {
      await NoteService.deleteNote(id)
      setError(null)
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
    } catch (err) {
      setError('Failed to delete note')
      console.error(err)
    }
  }

  const handleViewModeChange = (mode: 'active' | 'archived') => {
    setViewMode(mode)
  }

  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleCategorySelectionChange = (categoryIds: number[]) => {
    setSelectedCategoriesForNote(categoryIds)
  }

  const handleAssignCategories = async (noteId: number, categoryIds: number[]) => {
    try {
      const currentNote = notes.find(note => note.id === noteId)
      const currentCategoryIds = currentNote?.categories?.map(cat => cat.id) || []
      const categoriesToAdd = categoryIds.filter(id => !currentCategoryIds.includes(id))
      const categoriesToRemove = currentCategoryIds.filter(id => !categoryIds.includes(id))

      for (const categoryId of categoriesToAdd) {
        await NoteService.assignCategoryToNote(noteId, categoryId)
      }
      for (const categoryId of categoriesToRemove) {
        await NoteService.removeCategoryFromNote(noteId, categoryId)
      }

      const selectedCategories = categories.filter(cat => categoryIds.includes(cat.id))
      if (currentNote) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note.id === noteId 
              ? { ...note, categories: selectedCategories }
              : note
          )
        )
      } else {
        const newNote = await NoteService.getAllNotes().then(notes => notes.find(note => note.id === noteId))
        if (newNote) {
          setNotes(prevNotes => [...prevNotes, { ...newNote, categories: selectedCategories }])
        }
      }
      setError(null)
    } catch (err) {
      setError('Failed to update note categories')
      console.error(err)
    }
  }

  const handleRemoveCategoryFromNote = async (noteId: number, categoryId: number) => {
    try {
      await NoteService.removeCategoryFromNote(noteId, categoryId)
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId 
            ? { 
                ...note, 
                categories: note.categories?.filter(cat => cat.id !== categoryId) || []
              }
            : note
        )
      )
      setError(null)
    } catch (err) {
      setError('Failed to remove category from note')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="app">Loading notes...</div>
  }

  return (
    <div className="app">
      <h1>Notes App</h1>
      {error && <div className="error">{error}</div>}
      <div className="view-mode-selector">
        <button 
          onClick={() => handleViewModeChange('active')}
          className={viewMode === 'active' ? 'active' : ''}
        >
          Active Notes
        </button>
        <button 
          onClick={() => handleViewModeChange('archived')}
          className={viewMode === 'archived' ? 'active' : ''}
        >
          Archived Notes
        </button>
      </div>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryFilterChange}
      />
      <form onSubmit={handleCreateNote} className="note-form">
        <h2>Create New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          required
        />
        <CategorySelector
          categories={categories}
          selectedCategories={selectedCategoriesForNote}
          onCategoryChange={handleCategorySelectionChange}
        />
        <button type="submit">Create Note</button>
      </form>
      <div className="notes-section">
        <h2>{viewMode === 'active' ? 'Active Notes' : 'Archived Notes'} ({notes.length})</h2>
        {notes.length === 0 ? (
          <p>There are no {viewMode === 'active' ? 'active notes' : 'archived notes'}</p>
        ) : (
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className={`note ${note.archived ? 'archived' : ''}`}>
                {editingNote?.id === note.id ? (
                  <div className="note-edit-mode">
                    <input
                      type="text"
                      placeholder="Title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="edit-title"
                    />
                    <textarea
                      placeholder="Content"
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      className="edit-content"
                    />
                    <CategorySelector
                      categories={categories}
                      selectedCategories={selectedCategoriesForNote}
                      onCategoryChange={handleCategorySelectionChange}
                    />
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="save-edit">
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="cancel-edit">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <CategoryTags
                      categories={note.categories || []}
                      onRemoveCategory={(categoryId) => handleRemoveCategoryFromNote(note.id, categoryId)}
                      showRemoveButton={true}
                    />
                    <div className="note-meta">
                      <span>ID: {note.id}</span>
                      <span>Archived: {note.archived ? 'Yes' : 'No'}</span>
                      <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="note-actions">
                      <button onClick={() => handleStartEdit(note)} className="edit">
                        Edit
                      </button>
                      <button onClick={() => handleToggleArchive(note.id)}>
                        {note.archived ? 'Unarchive' : 'Archive'}
                      </button>
                      <button onClick={() => handleDeleteNote(note.id)} className="delete">
                        Delete
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
