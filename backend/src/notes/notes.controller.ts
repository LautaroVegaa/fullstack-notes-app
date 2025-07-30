import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
  } from '@nestjs/common';
  import { NotesService } from './notes.service';
  import { Note } from './note.entity';
  import { UpdateNoteDto } from './dto/update-note.dto';
  
  /**
   * Controller for handling note-related HTTP requests
   * Provides REST API endpoints for CRUD operations on notes
   */
  @Controller('notes')
  export class NotesController {
    constructor(private readonly notesService: NotesService) {}
  
    /**
     * Get notes with optional filtering by archived status
     * @param archived Optional archived status filter ('true' or 'false')
     * @returns Promise<Note[]> Array of filtered notes
     */
    @Get()
    findAll(@Query('archived') archived?: string): Promise<Note[]> {
      return this.notesService.findAll(archived);
    }
  
    /**
     * Create a new note
     * @param noteData Partial note data (title, content)
     * @returns Promise<Note> The created note
     */
    @Post()
    create(@Body() noteData: Partial<Note>): Promise<Note> {
      return this.notesService.create(noteData);
    }
  
    /**
     * Update an existing note by ID
     * @param id Note ID
     * @param updateNoteDto Updated note data
     * @returns Promise<Note> The updated note
     */
    @Put(':id')
    update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
      return this.notesService.update(+id, updateNoteDto);
    }
  
    /**
     * Delete a note by ID
     * @param id Note ID to delete
     */
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.notesService.remove(+id);
    }
  
    /**
     * Toggle archive status of a note
     * @param id Note ID
     * @returns Promise<Note> The note with updated archive status
     */
    @Put(':id/archive')
    toggleArchive(@Param('id') id: string) {
      return this.notesService.toggleArchive(+id);
    }
  }
  