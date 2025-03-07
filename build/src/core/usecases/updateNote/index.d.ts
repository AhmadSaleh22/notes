import { Note } from '@core/domain/entities/note';
import { DataStorage } from '@core/driven-port/store/storage';
type UpdateNoteUsecase = (dataStore: DataStorage) => ({ id, content, title }: {
    title: Note['title'];
    content: Note['content'];
    id: Note['id'];
}) => Promise<Note>;
declare const updateNoteuseCase: UpdateNoteUsecase;
export { updateNoteuseCase };
