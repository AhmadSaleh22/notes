import { Note } from '@core/domain/entities/note';
import { QueryOptions } from 'mysql2';
type GetAllNotesQuery = () => QueryOptions;
type SaveNoteQuery = ({ content, title, id }: {
    id: Note['id'];
    title: Note['title'];
    content: Note['content'];
}) => QueryOptions;
type UpdateNoteQuery = ({ id, title, content }: {
    id: Note['id'];
    title: Note['title'];
    content: Note['content'];
}) => QueryOptions;
type DeleteNoteQuery = ({ id }: {
    id: Note['id'];
}) => QueryOptions;
type GetNoteByIdQuery = ({ id }: {
    id: Note['id'];
}) => QueryOptions;
declare const getAllNotes: GetAllNotesQuery;
declare const saveNotesQuery: SaveNoteQuery;
declare const updateNoteQuery: UpdateNoteQuery;
declare const deleteNoteQuery: DeleteNoteQuery;
declare const getNoteByIdQuery: GetNoteByIdQuery;
export { getAllNotes, saveNotesQuery, updateNoteQuery, deleteNoteQuery, getNoteByIdQuery };
