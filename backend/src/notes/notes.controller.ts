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
  import { Category } from './category.entity';
  import { UpdateNoteDto } from './dto/update-note.dto';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { AssignCategoryDto } from './dto/assign-category.dto';
  
  /**
   * Controller for handling note-related HTTP requests
   * Provides REST API endpoints for CRUD operations on notes
   */
  @Controller('notes')
  export class NotesController {
    constructor(private readonly notesService: NotesService) {}
  
    /**
     * Get notes with optional filtering by archived status and category
     * @param archived Optional archived status filter ('true' or 'false')
     * @param category Optional category name filter
     * @returns Promise<Note[]> Array of filtered notes
     */
    @Get()
    findAll(@Query('archived') archived?: string, @Query('category') category?: string): Promise<Note[]> {
      return this.notesService.findAll(archived, category);
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

    // ===== CATEGORY ENDPOINTS =====

    /**
     * Create a new category
     * @param createCategoryDto Category data to create
     * @returns Promise<Category> The created category
     */
    @Post('category')
    createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
      return this.notesService.createCategory(createCategoryDto);
    }

    /**
     * Get all categories
     * @returns Promise<Category[]> Array of all categories
     */
    @Get('category')
    findAllCategories(): Promise<Category[]> {
      return this.notesService.findAllCategories();
    }

    /**
     * Assign a category to a note
     * @param noteId Note ID
     * @param assignCategoryDto Category assignment data
     * @returns Promise<Note> The note with updated categories
     */
    @Post(':noteId/category')
    assignCategoryToNote(
      @Param('noteId') noteId: string,
      @Body() assignCategoryDto: AssignCategoryDto
    ): Promise<Note> {
      return this.notesService.assignCategoryToNote(+noteId, assignCategoryDto);
    }

    /**
     * Remove a category from a note
     * @param noteId Note ID
     * @param categoryId Category ID to remove
     * @returns Promise<Note> The note with updated categories
     */
    @Delete(':noteId/category/:categoryId')
    removeCategoryFromNote(
      @Param('noteId') noteId: string,
      @Param('categoryId') categoryId: string
    ): Promise<Note> {
      return this.notesService.removeCategoryFromNote(+noteId, +categoryId);
    }
  }
  