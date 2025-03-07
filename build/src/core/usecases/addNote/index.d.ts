import { Note } from '@core/domain/entities/note';
import { DataStorage } from '@core/driven-port/store/storage';
type CreateNoteUsecase = (dataStore: DataStorage) => ({ content, title }: {
    content: Note['content'];
    title: Note['title'];
}) => Promise<Note>;
declare const createNoteUseCase: CreateNoteUsecase;
export { createNoteUseCase };
