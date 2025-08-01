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
  
  // State for categories
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedCategoriesForNote, setSelectedCategoriesForNote] = useState<number[]>([])

  // Load notes when component mounts
  useEffect(() => {
    loadNotes()
    loadCategories()
  }, [viewMode, selectedCategory])

  /**
   * Load notes based on current view mode and selected category
   */
  const loadNotes = async () => {
    try {
      setLoading(true)
      let notesData: Note[]
      
      if (selectedCategory) {
        // Filter by category and archived status
        notesData = await NoteService.getNotesByCategory(selectedCategory, viewMode === 'archived')
      } else {
        // Load all notes based on archived status
        notesData = viewMode === 'active' 
          ? await NoteService.getActiveNotes()
          : await NoteService.getArchivedNotes()
      }
      
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
   * Load all categories from the backend
   */
  const loadCategories = async () => {
    try {
      const categoriesData = await NoteService.getAllCategories()
      setCategories(categoriesData)
    } catch (err) {
      console.error('Error al cargar las categorías:', err)
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
      const createdNote = await NoteService.createNote(newNote)
      setNewNote({ title: '', content: '' })
      setSelectedCategoriesForNote([])
      setError(null)
      
      // Assign categories if any are selected
      if (selectedCategoriesForNote.length > 0) {
        await handleAssignCategories(createdNote.id, selectedCategoriesForNote)
      } else {
        // Reload notes to show the new one
        await loadNotes()
      }
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
    setSelectedCategoriesForNote(note.categories?.map(cat => cat.id) || [])
  }

  /**
   * Cancel editing
   */
  const handleCancelEdit = () => {
    setEditingNote(null)
    setEditForm({ title: '', content: '' })
    setSelectedCategoriesForNote([])
  }

  /**
   * Save edited note
   */
  const handleSaveEdit = async () => {
    if (!editingNote || !editForm.title.trim() || !editForm.content.trim()) return

    try {
      await NoteService.updateNote(editingNote.id, editForm)
      
      // Update categories if any are selected
      if (selectedCategoriesForNote.length > 0) {
        await handleAssignCategories(editingNote.id, selectedCategoriesForNote)
      }
      
      setEditingNote(null)
      setEditForm({ title: '', content: '' })
      setSelectedCategoriesForNote([])
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

  /**
   * Handle category filter change
   * @param category Category name to filter by
   */
  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategory(category)
  }

  /**
   * Handle category selection for new note
   * @param categoryIds Array of selected category IDs
   */
  const handleCategorySelectionChange = (categoryIds: number[]) => {
    setSelectedCategoriesForNote(categoryIds)
  }

  /**
   * Assign categories to a note
   * @param noteId Note ID
   * @param categoryIds Array of category IDs to assign
   */
  const handleAssignCategories = async (noteId: number, categoryIds: number[]) => {
    try {
      // Get current note categories
      const currentNote = notes.find(note => note.id === noteId)
      const currentCategoryIds = currentNote?.categories?.map(cat => cat.id) || []
      
      // Find categories to add (new ones)
      const categoriesToAdd = categoryIds.filter(id => !currentCategoryIds.includes(id))
      
      // Find categories to remove (old ones not in new selection)
      const categoriesToRemove = currentCategoryIds.filter(id => !categoryIds.includes(id))
      
      // Add new categories
      for (const categoryId of categoriesToAdd) {
        await NoteService.assignCategoryToNote(noteId, categoryId)
      }
      
      // Remove old categories
      for (const categoryId of categoriesToRemove) {
        await NoteService.removeCategoryFromNote(noteId, categoryId)
      }
      
      // Reload notes to show updated categories
      await loadNotes()
      setError(null)
    } catch (err) {
      setError('Error al actualizar las categorías de la nota')
      console.error(err)
    }
  }

  /**
   * Remove a category from a note
   * @param noteId Note ID
   * @param categoryId Category ID to remove
   */
  const handleRemoveCategoryFromNote = async (noteId: number, categoryId: number) => {
    try {
      await NoteService.removeCategoryFromNote(noteId, categoryId)
      await loadNotes() // Reload to show updated note
      setError(null)
    } catch (err) {
      setError('Error al quitar la categoría de la nota')
      console.error(err)
    }
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

      {/* Category filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryFilterChange}
      />

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
        <CategorySelector
          categories={categories}
          selectedCategories={selectedCategoriesForNote}
          onCategoryChange={handleCategorySelectionChange}
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
                    <CategorySelector
                      categories={categories}
                      selectedCategories={selectedCategoriesForNote}
                      onCategoryChange={handleCategorySelectionChange}
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
                    {/* Category tags */}
                    <CategoryTags
                      categories={note.categories || []}
                      onRemoveCategory={(categoryId) => handleRemoveCategoryFromNote(note.id, categoryId)}
                      showRemoveButton={true}
                    />
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
