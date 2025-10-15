import React, { useState, useEffect } from 'react';
import '../styles/notesEditor.css';


interface NotesEditorProps {
  notes: string[];
  onNotesChange: (notes: string[]) => void;
  className?: string;
  readOnly?: boolean;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ 
  notes, 
  onNotesChange, 
  className = '',
  readOnly = false 
}) => {
  const [newNote, setNewNote] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onNotesChange([...notes, newNote.trim()]);
      setNewNote('');
    }
  };

  const handleEditNote = (index: number) => {
    setEditingIndex(index);
    setEditingText(notes[index]);
  };

  const handleSaveEdit = () => {
    if (editingText.trim() && editingIndex !== null) {
      const updatedNotes = [...notes];
      updatedNotes[editingIndex] = editingText.trim();
      onNotesChange(updatedNotes);
      setEditingIndex(null);
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingText('');
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    onNotesChange(updatedNotes);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      if (editingIndex !== null) {
        handleSaveEdit();
      } else {
        handleAddNote(e);
      }
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Notes & Tips</h3>
        <span className="text-sm text-gray-500">{notes.length} notes</span>
      </div>

      {/* Add New Note */}
      {!readOnly && (
        <form onSubmit={handleAddNote} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note or tip..."
              className="form-input flex-1"
              onKeyPress={handleKeyPress}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!newNote.trim()}
            >
              Add
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Press Ctrl+Enter to quickly add notes
          </p>
        </form>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="icon-2xl text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm">No notes yet. Add your first tip or note!</p>
          </div>
        ) : (
          notes.map((note, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              {editingIndex === index ? (
                <div className="space-y-3">
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="form-input form-textarea w-full"
                    rows={3}
                    onKeyPress={handleKeyPress}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="btn btn-primary text-sm"
                      disabled={!editingText.trim()}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-outline text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <p className="text-gray-700 flex-1 pr-3">{note}</p>
                  {!readOnly && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditNote(index)}
                        className="p-1 text-gray-400 hover:text-primary-orange transition-colors"
                        title="Edit note"
                      >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteNote(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete note"
                      >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesEditor;