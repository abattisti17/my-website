import React, { useState, useEffect } from 'react';
import { useFeatureFlag } from '../hooks/useFeatureFlag';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const localStorageEnabled = useFeatureFlag('localStorageEnabled');

  // Load notes from localStorage on mount
  useEffect(() => {
    if (localStorageEnabled) {
      try {
        const savedNotes = localStorage.getItem('notes-app-data');
        if (savedNotes) {
          const parsed = JSON.parse(savedNotes).map((note: any) => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt),
          }));
          setNotes(parsed);
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    }
  }, [localStorageEnabled]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (localStorageEnabled && notes.length > 0) {
      try {
        localStorage.setItem('notes-app-data', JSON.stringify(notes));
      } catch (error) {
        console.error('Failed to save notes:', error);
      }
    }
  }, [notes, localStorageEnabled]);

  const createNote = () => {
    if (!newTitle.trim() && !newContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: newTitle.trim() || 'Untitled Note',
      content: newContent.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes(prev => [newNote, ...prev]);
    setNewTitle('');
    setNewContent('');
    setSelectedNote(newNote);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updatedAt: new Date() }
        : note
    ));
    setSelectedNote({ ...updatedNote, updatedAt: new Date() });
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '600px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Sidebar */}
      <div style={{
        width: '300px',
        borderRight: '1px solid #ddd',
        background: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* New Note Form */}
        <div style={{ padding: '16px', borderBottom: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>📝 Notes App</h3>
          <input
            type="text"
            placeholder="Note title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              marginBottom: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          />
          <textarea
            placeholder="Start writing..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{
              width: '100%',
              height: '60px',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'none',
            }}
          />
          <button
            onClick={createNote}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '8px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Add Note
          </button>
          {!localStorageEnabled && (
            <div style={{
              marginTop: '8px',
              padding: '8px',
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#856404',
            }}>
              ⚠️ Storage disabled - notes won't persist
            </div>
          )}
        </div>

        {/* Notes List */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {notes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                background: selectedNote?.id === note.id ? '#e3f2fd' : 'transparent',
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                {note.title}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                {note.content.substring(0, 50)}...
              </div>
              <div style={{ fontSize: '11px', color: '#999' }}>
                {note.updatedAt.toLocaleDateString()}
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <div style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: '#666',
              fontSize: '14px',
            }}>
              No notes yet. Create your first note!
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedNote ? (
          <>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      padding: '4px 8px',
                    }}
                  />
                ) : (
                  selectedNote.title
                )}
              </h2>
              <div>
                {isEditing ? (
                  <>
                    <button
                      onClick={() => updateNote(selectedNote)}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{
                        padding: '6px 12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        marginRight: '8px',
                        padding: '6px 12px',
                        background: '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(selectedNote.id)}
                      style={{
                        padding: '6px 12px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            <div style={{ flex: 1, padding: '16px' }}>
              {isEditing ? (
                <textarea
                  value={selectedNote.content}
                  onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '12px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'none',
                  }}
                />
              ) : (
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}>
                  {selectedNote.content}
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '16px',
          }}>
            Select a note to view or create a new one
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;
