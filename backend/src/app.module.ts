import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './notes/note.entity';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'notes.db',
      entities: [Note],
      synchronize: true, // 🔥 SOLO para desarrollo
    }),
    TypeOrmModule.forFeature([Note]),
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
