import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  findAll(): Promise<Note[]> {
    return this.noteRepository.find({ order: { createdAt: 'DESC' } });
  }

  create(noteData: Partial<Note>): Promise<Note> {
    const note = this.noteRepository.create(noteData);
    return this.noteRepository.save(note);
  }

  async update(id: number, updateData: Partial<Note>): Promise<Note> {
    await this.noteRepository.update(id, updateData);
    const updated = await this.noteRepository.findOneBy({ id });
    if (!updated) throw new Error('Note not found');
    return updated;
  }
  

  async remove(id: number): Promise<void> {
    await this.noteRepository.delete(id);
  }

  async toggleArchive(id: number): Promise<Note> {
    const note = await this.noteRepository.findOneBy({ id });
    if (!note) throw new Error('Note not found');
    note.archived = !note.archived;
    return this.noteRepository.save(note);
  }
  
}
