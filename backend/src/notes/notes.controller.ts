import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
  } from '@nestjs/common';
  import { NotesService } from './notes.service';
  import { Note } from './note.entity';
  
  @Controller('notes')
  export class NotesController {
    constructor(private readonly notesService: NotesService) {}
  
    @Get()
    findAll(): Promise<Note[]> {
      return this.notesService.findAll();
    }
  
    @Post()
    create(@Body() noteData: Partial<Note>): Promise<Note> {
      return this.notesService.create(noteData);
    }
  
    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<Note>) {
      return this.notesService.update(+id, data);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.notesService.remove(+id);
    }
  
    @Put(':id/archive')
    toggleArchive(@Param('id') id: string) {
      return this.notesService.toggleArchive(+id);
    }
  }
  