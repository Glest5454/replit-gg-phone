import { ArrowLeft, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface NotesAppProps {
  onBack: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Shopping List',
    content: 'Milk\nBread\nEggs\nCheese\nApples',
    color: '#fbbf24',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Discussed quarterly goals\nAction items:\n- Update project timeline\n- Schedule follow-up meeting\n- Review budget allocation',
    color: '#22c55e',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Ideas',
    content: 'App improvements:\n- Dark mode toggle\n- Voice notes\n- Photo attachments\n- Better search functionality',
    color: '#3b82f6',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13'
  }
];

export const NotesApp = ({ onBack }: NotesAppProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedNote) {
      // This would save to the database in a real implementation
      console.log('Saving note:', selectedNote.id, editContent);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (selectedNote) {
    return (
      <div className="absolute inset-0 notes-app flex flex-col">
        {/* Note Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button 
            className="oneui-button p-2" 
            onClick={() => setSelectedNote(null)}
            data-testid="note-back"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button 
                className="oneui-button p-2"
                onClick={handleEdit}
                data-testid="note-edit"
              >
                <Edit className="w-5 h-5 text-white" />
              </button>
            )}
            {isEditing && (
              <button 
                className="oneui-button bg-samsung-blue text-white px-4 py-2 rounded-samsung-sm"
                onClick={handleSave}
                data-testid="note-save"
              >
                Save
              </button>
            )}
            <button 
              className="oneui-button p-2"
              data-testid="note-delete"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Note Content */}
        <div className="flex-1 p-4">
          <div 
            className="p-4 rounded-samsung-sm mb-4"
            style={{ backgroundColor: selectedNote.color + '20' }}
          >
            <h2 className="text-white text-lg font-semibold mb-2">{selectedNote.title}</h2>
            <p className="text-white/70 text-sm">Updated {formatDate(selectedNote.updatedAt)}</p>
          </div>
          
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full h-96 bg-surface-dark/30 text-white p-4 rounded-samsung-sm border border-white/10 resize-none outline-none"
              placeholder="Start writing..."
              data-testid="note-editor"
            />
          ) : (
            <div 
              className="text-white whitespace-pre-wrap p-4 bg-surface-dark/30 rounded-samsung-sm min-h-96"
              data-testid="note-content"
            >
              {selectedNote.content}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 notes-app flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="notes-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Notes</h1>
        <div className="flex items-center space-x-2">
          <button 
            className="oneui-button p-2"
            data-testid="notes-search"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
          <button 
            className="oneui-button p-2"
            data-testid="notes-add"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 p-4">
        {mockNotes.length > 0 ? (
          <div className="space-y-3">
            {mockNotes.map((note) => (
              <button
                key={note.id}
                className="oneui-button w-full text-left p-4 rounded-samsung-sm border-l-4 bg-surface-dark/30"
                style={{ borderLeftColor: note.color }}
                onClick={() => handleNoteSelect(note)}
                data-testid={`note-${note.id}`}
              >
                <h3 className="text-white font-medium text-base mb-1">{note.title}</h3>
                <p className="text-white/70 text-sm line-clamp-2 mb-2">
                  {note.content.replace(/\n/g, ' ').substring(0, 100)}...
                </p>
                <p className="text-white/50 text-xs">{formatDate(note.updatedAt)}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="w-16 h-16 bg-surface-dark/50 rounded-samsung mx-auto mb-4 flex items-center justify-center">
                📝
              </div>
              <h3 className="text-lg font-medium mb-2">No Notes</h3>
              <p className="text-sm">Tap + to create your first note</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
