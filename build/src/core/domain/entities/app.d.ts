import { Note } from './note';
interface App {
    getNotes: () => Promise<Note[]>;
    createNote: ({ content, title }: {
        content: string;
        title: string;
    }) => Promise<Note>;
    updateNote: ({ id, content, title }: {
        id: string;
        content: string;
        title: string;
    }) => Promise<Note>;
    getNoteById: ({ id }: {
        id: string;
    }) => Promise<Note>;
    deleteNote: ({ id }: {
        id: string;
    }) => Promise<undefined>;
}
export type { App };
