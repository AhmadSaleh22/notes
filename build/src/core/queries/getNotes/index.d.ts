import type { Note } from '@core/domain/entities/note';
import { DataStorage } from '@core/driven-port/store/storage';
type QueryGetNotes = (dataStore: DataStorage) => () => Promise<Note[]>;
declare const queryGetNotes: QueryGetNotes;
export { queryGetNotes };
