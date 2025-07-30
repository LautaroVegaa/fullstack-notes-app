/**
 * Interface representing a note in the application
 * Matches the backend Note entity structure
 */
export interface Note {
  /** Unique identifier for the note */
  id: number;
  /** Title of the note */
  title: string;
  /** Content/body of the note */
  content: string;
  /** Whether the note is archived or not */
  archived: boolean;
  /** ISO string timestamp when the note was created */
  createdAt: string;
}

/** Base URL for the backend API */
const API_BASE_URL = 'http://localhost:3000';

/**
 * Service class for handling API communication with the backend
 * Provides methods for all CRUD operations and note management
 */
export class NoteService {
  /**
   * Fetch all notes from the backend
   * @returns Promise<Note[]> Array of all notes
   * @throws Error if the request fails
   */
  static async getAllNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes`);
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    return response.json();
  }

  /**
   * Fetch only active (non-archived) notes
   * @returns Promise<Note[]> Array of active notes
   * @throws Error if the request fails
   */
  static async getActiveNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes?archived=false`);
    if (!response.ok) {
      throw new Error('Failed to fetch active notes');
    }
    return response.json();
  }

  /**
   * Fetch only archived notes
   * @returns Promise<Note[]> Array of archived notes
   * @throws Error if the request fails
   */
  static async getArchivedNotes(): Promise<Note[]> {
    const response = await fetch(`${API_BASE_URL}/notes?archived=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch archived notes');
    }
    return response.json();
  }

  /**
   * Create a new note
   * @param noteData Object containing title and content
   * @returns Promise<Note> The created note with server-generated fields
   * @throws Error if the request fails
   */
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

  /**
   * Update an existing note
   * @param id Note ID to update
   * @param noteData Object containing updated title and content
   * @returns Promise<Note> The updated note
   * @throws Error if the request fails
   */
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

  /**
   * Delete a note by ID
   * @param id Note ID to delete
   * @returns Promise<void>
   * @throws Error if the request fails
   */
  static async deleteNote(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
  }

  /**
   * Toggle the archive status of a note
   * @param id Note ID to toggle archive status
   * @returns Promise<Note> The note with updated archive status
   * @throws Error if the request fails
   */
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