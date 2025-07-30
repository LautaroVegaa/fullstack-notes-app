export interface Note {
  id: number;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:3000';

export class NoteService {
  // Obtener todas las notas
  static async getAllNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return response.json();
  }

  // Obtener notas activas
  static async getActiveNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes/active`);
    if (!response.ok) {
      throw new Error('Failed to fetch active notes');
    }
    return response.json();
  }

  // Obtener notas archivadas
  static async getArchivedNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes/archived`);
    if (!response.ok) {
      throw new Error('Failed to fetch archived notes');
    }
    return response.json();
  }

  // Crear una nueva nota
  static async createNote(noteData: { title: string; content: string }): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    return response.json();
  }

  // Actualizar una nota
  static async updateNote(id: number, noteData: { title: string; content: string }): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteData),
    });
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    return response.json();
  }

  // Eliminar una nota
  static async deleteNote(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  }

  // Archivar/desarchivar una nota
  static async toggleArchive(id: number): Promise<Note> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}/archive`, {
      method: 'PUT',
    });
    if (!response.ok) {
      throw new Error('Failed to toggle archive');
    }
    return response.json();
  }
} 