import type { Note } from '@core/domain/entities/note';
import { DataStorage } from '@core/driven-port/store/storage';
type DeleteNoteUsecase = (dataStore: DataStorage) => ({ id }: {
    id: Note['id'];
}) => Promise<Note>;
declare const deleteNoteUsecase: DeleteNoteUsecase;
export { deleteNoteUsecase };
