import type { Note } from '@core/domain/entities/note';
interface StoredNote {
    id: Note['id'];
    content: Note['content'];
    title: Note['title'];
}
interface DataStorage {
    getAllNotes: () => Promise<StoredNote[]>;
    createNote: ({ title, content }: {
        title: Note['title'];
        content: Note['content'];
    }) => Promise<StoredNote>;
    updateNote: ({ id, content, title }: {
        title: Note['title'];
        content: Note['content'];
        id: Note['id'];
    }) => Promise<StoredNote>;
    deleteNote: ({ id }: {
        id: Note['id'];
    }) => Promise<StoredNote>;
    getNoteById: ({ id }: {
        id: Note['id'];
    }) => Promise<StoredNote>;
    stop: () => Promise<void>;
}
export type { DataStorage, StoredNote };
