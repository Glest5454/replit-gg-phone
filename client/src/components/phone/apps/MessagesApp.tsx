import { ArrowLeft, Plus, Search, Send, Phone, MessageCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MessagesAppProps {
  onBack: () => void;
}

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export const MessagesApp = ({ onBack }: MessagesAppProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Form states
  const [newMessageForm, setNewMessageForm] = useState({
    phoneNumber: '',
    message: ''
  });

  // Mock test data for development
  const mockContacts: Contact[] = [
    {
      id: '1',
      name: 'John Doe',
      phoneNumber: '555-0123',
      lastMessage: 'Hey, how are you?',
      lastMessageTime: '2 hours ago',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Jane Smith',
      phoneNumber: '555-0456',
      lastMessage: 'See you tomorrow!',
      lastMessageTime: '1 day ago',
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Mike Johnson',
      phoneNumber: '555-0789',
      lastMessage: 'Thanks for the help!',
      lastMessageTime: '3 days ago',
      unreadCount: 1
    }
  ];

  // Load contacts on mount
  useEffect(() => {
    setContacts(mockContacts);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const openChat = (contact: Contact) => {
    setSelectedContact(contact);
    // Load messages for this contact
    setMessages([
      {
        id: '1',
        sender: contact.phoneNumber,
        receiver: 'me',
        content: 'Hey, how are you?',
        timestamp: '2 hours ago',
        isOutgoing: false
      },
      {
        id: '2',
        sender: 'me',
        receiver: contact.phoneNumber,
        content: 'I\'m good, thanks! How about you?',
        timestamp: '1 hour ago',
        isOutgoing: true
      }
    ]);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !selectedContact) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      receiver: selectedContact.phoneNumber,
      content: messageText.trim(),
      timestamp: 'now',
      isOutgoing: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    
    // In production: TriggerServerEvent('gg-phone:server:sendMessage', selectedContact.phoneNumber, messageText)
  };

  const sendNewMessage = () => {
    if (!newMessageForm.phoneNumber.trim() || !newMessageForm.message.trim()) return;
    
    // Find contact or create new one
    let contact = contacts.find(c => c.phoneNumber === newMessageForm.phoneNumber);
    if (!contact) {
      contact = {
        id: Date.now().toString(),
        name: `Unknown (${newMessageForm.phoneNumber})`,
        phoneNumber: newMessageForm.phoneNumber,
        unreadCount: 0
      };
      setContacts(prev => [contact!, ...prev]);
    }
    
    // Open chat with this contact
    setSelectedContact(contact);
    setMessages([{
      id: Date.now().toString(),
      sender: 'me',
      receiver: contact.phoneNumber,
      content: newMessageForm.message.trim(),
      timestamp: 'now',
      isOutgoing: true
    }]);
    
    setNewMessageForm({ phoneNumber: '', message: '' });
    setShowNewMessage(false);
  };

  const callContact = (contact: Contact) => {
    console.log('Calling contact:', contact.phoneNumber);
    // In production: TriggerServerEvent('gg-phone:server:startCall', contact.phoneNumber)
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phoneNumber.includes(searchQuery);
    return matchesSearch;
  });

  // Chat View
  if (selectedContact) {
    return (
      <div className="absolute inset-0 bg-oneui-dark flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 mt-2">
          <button 
            className="oneui-button p-2 -ml-2" 
            onClick={() => setSelectedContact(null)}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {getInitials(selectedContact.name)}
              </span>
            </div>
            <div>
              <h3 className="text-white font-medium">{selectedContact.name}</h3>
              <p className="text-white/60 text-sm">{selectedContact.phoneNumber}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              className="oneui-button p-2 bg-green-500/20 rounded-full"
              onClick={() => callContact(selectedContact)}
            >
              <Phone className="w-4 h-4 text-green-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.isOutgoing
                    ? 'bg-blue-400 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isOutgoing ? 'text-blue-100' : 'text-white/50'
                }`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
              onClick={sendMessage}
              disabled={!messageText.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Messages View
  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Messages</h1>
        <button 
          className="oneui-button p-2"
          onClick={() => setShowNewMessage(true)}
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 text-white placeholder-white/60 pl-10 pr-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          <div className="p-4 space-y-2">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                className="w-full flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-left"
                onClick={() => openChat(contact)}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{getInitials(contact.name)}</span>
                  </div>
                  {contact.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{contact.unreadCount}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{contact.name}</h3>
                  {contact.lastMessage && (
                    <p className="text-white/60 text-sm truncate">{contact.lastMessage}</p>
                  )}
                  {contact.lastMessageTime && (
                    <p className="text-white/40 text-xs">{contact.lastMessageTime}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 bg-green-500/20 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      callContact(contact);
                    }}
                  >
                    <Phone className="w-4 h-4 text-green-400" />
                  </button>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="w-16 h-16 bg-white/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                💬
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No messages found' : 'No messages yet'}
              </h3>
              <p className="text-sm mb-4">
                {searchQuery 
                  ? 'Try a different search term' 
                  : 'Start a conversation with your contacts'
                }
              </p>
              {!searchQuery && (
                <button 
                  className="bg-blue-400 text-white px-6 py-2 rounded-lg font-medium"
                  onClick={() => setShowNewMessage(true)}
                >
                  New Message
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-oneui-dark rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">New Message</h3>
              <button
                className="oneui-button p-2"
                onClick={() => setShowNewMessage(false)}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={newMessageForm.phoneNumber}
                onChange={(e) => setNewMessageForm({ ...newMessageForm, phoneNumber: e.target.value })}
              />
              <textarea
                placeholder="Message"
                rows={4}
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                value={newMessageForm.message}
                onChange={(e) => setNewMessageForm({ ...newMessageForm, message: e.target.value })}
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                className="flex-1 bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
                onClick={() => setShowNewMessage(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-blue-400 text-white py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
                onClick={sendNewMessage}
                disabled={!newMessageForm.phoneNumber.trim() || !newMessageForm.message.trim()}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
