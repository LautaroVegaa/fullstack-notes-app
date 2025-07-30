import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { UpdateNoteDto } from './dto/update-note.dto';

/**
 * Service for handling note business logic
 * Provides methods for CRUD operations and note management
 */
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  /**
   * Retrieve notes with optional filtering by archived status
   * @param archived Optional archived status filter ('true' or 'false')
   * @returns Promise<Note[]> Array of filtered notes
   */
  findAll(archived?: string): Promise<Note[]> {
    const whereCondition: any = {};
    
    if (archived !== undefined) {
      whereCondition.archived = archived === 'true';
    }
    
    return this.noteRepository.find({ 
      where: whereCondition,
      order: { createdAt: 'DESC' } 
    });
  }

  /**
   * Create a new note
   * @param noteData Partial note data containing title and content
   * @returns Promise<Note> The created note with generated ID and timestamp
   */
  create(noteData: Partial<Note>): Promise<Note> {
    const note = this.noteRepository.create(noteData);
    return this.noteRepository.save(note);
  }

  /**
   * Update an existing note by ID
   * @param id Note ID to update
   * @param updateNoteDto Note data to update
   * @returns Promise<Note> The updated note
   * @throws NotFoundException if note is not found
   */
  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.noteRepository.findOneBy({ id });
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    
    await this.noteRepository.update(id, updateNoteDto);
    const updated = await this.noteRepository.findOneBy({ id });
    return updated!;
  }
  

  /**
   * Delete a note by ID
   * @param id Note ID to delete
   * @returns Promise<void>
   */
  async remove(id: number): Promise<void> {
    await this.noteRepository.delete(id);
  }

  /**
   * Toggle the archive status of a note
   * @param id Note ID to toggle archive status
   * @returns Promise<Note> The note with updated archive status
   * @throws NotFoundException if note is not found
   */
  async toggleArchive(id: number): Promise<Note> {
    const note = await this.noteRepository.findOneBy({ id });
    if (!note) throw new NotFoundException('Note not found');
    note.archived = !note.archived;
    return this.noteRepository.save(note);
  }
}
