import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './note.entity';
import { Category } from './category.entity';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AssignCategoryDto } from './dto/assign-category.dto';

/**
 * Service for handling note business logic
 * Provides methods for CRUD operations and note management
 */
@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Retrieve notes with optional filtering by archived status and category
   * @param archived Optional archived status filter ('true' or 'false')
   * @param category Optional category name filter
   * @returns Promise<Note[]> Array of filtered notes
   */
  findAll(archived?: string, category?: string): Promise<Note[]> {
    const whereCondition: any = {};
    
    if (archived !== undefined) {
      whereCondition.archived = archived === 'true';
    }
    
    const queryBuilder = this.noteRepository.createQueryBuilder('note')
      .leftJoinAndSelect('note.categories', 'categories')
      .orderBy('note.createdAt', 'DESC');
    
    if (archived !== undefined) {
      queryBuilder.andWhere('note.archived = :archived', { archived: archived === 'true' });
    }
    
    if (category) {
      queryBuilder.andWhere('categories.name = :category', { category });
    }
    
    return queryBuilder.getMany();
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

  // ===== CATEGORY METHODS =====

  /**
   * Create a new category
   * @param createCategoryDto Category data to create
   * @returns Promise<Category> The created category
   */
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  /**
   * Get all categories
   * @returns Promise<Category[]> Array of all categories
   */
  findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  /**
   * Assign a category to a note
   * @param noteId Note ID
   * @param assignCategoryDto Category assignment data
   * @returns Promise<Note> The note with updated categories
   * @throws NotFoundException if note or category is not found
   */
  async assignCategoryToNote(noteId: number, assignCategoryDto: AssignCategoryDto): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
      relations: ['categories']
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const category = await this.categoryRepository.findOneBy({ id: assignCategoryDto.categoryId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category is already assigned
    const isAlreadyAssigned = note.categories.some(cat => cat.id === category.id);
    if (isAlreadyAssigned) {
      return note; // Already assigned, return the note as is
    }

    note.categories.push(category);
    return this.noteRepository.save(note);
  }

  /**
   * Remove a category from a note
   * @param noteId Note ID
   * @param categoryId Category ID to remove
   * @returns Promise<Note> The note with updated categories
   * @throws NotFoundException if note or category is not found
   */
  async removeCategoryFromNote(noteId: number, categoryId: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
      relations: ['categories']
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Remove the category from the note's categories array
    note.categories = note.categories.filter(cat => cat.id !== categoryId);
    return this.noteRepository.save(note);
  }
}
