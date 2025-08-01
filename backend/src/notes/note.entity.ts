import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './category.entity';

/**
 * Note entity representing a note in the application
 * Maps to the 'note' table in the database
 */
@Entity()
export class Note {
  /** Unique identifier for the note */
  @PrimaryGeneratedColumn()
  id: number;

  /** Title of the note */
  @Column()
  title: string;

  /** Content/body of the note */
  @Column({ type: 'text' })
  content: string;

  /** Whether the note is archived or not */
  @Column({ default: false })
  archived: boolean;

  /** Timestamp when the note was created */
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /** Categories associated with this note */
  @ManyToMany(() => Category, category => category.notes)
  @JoinTable()
  categories: Category[];
}
