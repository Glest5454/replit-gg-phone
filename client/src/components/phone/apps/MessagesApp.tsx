import { ArrowLeft, Plus, Search, Send, Phone, MessageCircle, X, Smile, Image, MapPin, Paperclip, Mic } from 'lucide-react';
import { useState, useEffect } from 'react';
import { messagesAPI } from '@/utils/nui';

interface MessagesAppProps {
  onBack: () => void;
  selectedContact?: {
    id: string;
    name: string;
    phoneNumber: string;
    favorite?: boolean;
    avatar?: string;
  } | null;
  onNavigateToContacts?: (contact: {
    id: string;
    name: string;
    phoneNumber: string;
    favorite?: boolean;
    avatar?: string;
  }) => void;
}

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  type: 'text' | 'emoji' | 'gif' | 'photo' | 'location';
  metadata?: {
    emoji?: string;
    gifUrl?: string;
    photoUrl?: string;
    location?: {
      lat: number;
      lng: number;
      address: string;
    };
  };
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export const MessagesApp = ({ onBack, selectedContact, onNavigateToContacts }: MessagesAppProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentChatContact, setCurrentChatContact] = useState<Contact | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  // New state variables for additional features
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
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

  // Load contacts on mount and handle selected contact
  useEffect(() => {
    setContacts(mockContacts);
    
    // If a contact was selected from ContactsApp, open chat with them
    if (selectedContact) {
      const contact = {
        id: selectedContact.id,
        name: selectedContact.name,
        phoneNumber: selectedContact.phoneNumber,
        lastMessage: '',
        lastMessageTime: '',
        unreadCount: 0
      };
      
      // Add to contacts if not already there
      if (!mockContacts.find(c => c.phoneNumber === contact.phoneNumber)) {
        setContacts(prev => [contact, ...prev]);
      }
      
      // Open chat with this contact
      openChat(contact);
    }

    // Load all conversations from database
    messagesAPI.getAllMessages();
  }, [selectedContact]);

  // Listen for NUI message events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'messageSent') {
        console.log('Message sent successfully:', event.data.message);
        // Message was already added to UI, just confirm success
      } else if (event.data.action === 'messageReceived') {
        console.log('Message received:', event.data.message);
        // Handle incoming message if needed
      } else if (event.data.action === 'messagesLoaded') {
        console.log('Messages loaded:', event.data.messages);
        // Load messages from server for current contact
        if (currentChatContact) {
          const serverMessages = event.data.messages.map((msg: any) => ({
            id: msg.id,
            sender: msg.sender_id,
            receiver: msg.receiver_id,
            content: msg.message,
            timestamp: msg.timestamp,
            isOutgoing: msg.message_direction === 'outgoing',
            type: msg.message_type || 'text',
            metadata: msg.metadata
          }));
          setMessages(serverMessages);
        }
      } else if (event.data.action === 'allMessagesLoaded') {
        console.log('All conversations loaded:', event.data);
        // Update contacts with real conversation data
        const conversations = event.data;
        const updatedContacts = conversations.map((conv: any) => ({
          id: conv.id,
          name: conv.name,
          phoneNumber: conv.phone_number,
          lastMessage: conv.last_message || '',
          lastMessageTime: conv.last_message_time || '',
          unreadCount: conv.unread_count || 0
        }));
        setContacts(updatedContacts);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentChatContact]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const openChat = (contact: Contact) => {
    setCurrentChatContact(contact);
    // Load real messages for this contact from database
    messagesAPI.getMessages(contact.phoneNumber);
  };

  const sendMessage = () => {
    if (!messageText.trim() || !currentChatContact) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      receiver: currentChatContact.phoneNumber,
      content: messageText.trim(),
      timestamp: 'now',
      isOutgoing: true,
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send message via NUI API with metadata
    messagesAPI.send(currentChatContact.phoneNumber, messageText.trim(), 'text');
    
    setMessageText('');
  };

  // New message sending functions
  const sendEmoji = (emoji: string) => {
    if (!currentChatContact) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      receiver: currentChatContact.phoneNumber,
      content: emoji,
      timestamp: 'now',
      isOutgoing: true,
      type: 'emoji',
      metadata: { emoji }
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send message via NUI API with metadata
    messagesAPI.send(currentChatContact.phoneNumber, emoji, 'emoji', { emoji });
    
    setShowEmojiPicker(false);
  };

  const sendGif = (gifUrl: string) => {
    if (!currentChatContact) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      receiver: currentChatContact.phoneNumber,
      content: 'GIF',
      timestamp: 'now',
      isOutgoing: true,
      type: 'gif',
      metadata: { gifUrl }
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send message via NUI API with metadata
    messagesAPI.send(currentChatContact.phoneNumber, 'GIF', 'gif', { gifUrl });
    
    setShowGifPicker(false);
  };

  const sendPhoto = (photoUrl: string) => {
    if (!currentChatContact) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      receiver: currentChatContact.phoneNumber,
      content: 'Photo',
      timestamp: 'now',
      isOutgoing: true,
      type: 'photo',
      metadata: { photoUrl }
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send message via NUI API with metadata
    messagesAPI.send(currentChatContact.phoneNumber, 'Photo', 'photo', { photoUrl });
    
    setShowPhotoPicker(false);
  };

  const sendLocation = (lat: number, lng: number, address: string) => {
    if (!currentChatContact) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'me',
      receiver: currentChatContact.phoneNumber,
      content: 'Location',
      timestamp: 'now',
      isOutgoing: true,
      type: 'location',
      metadata: { location: { lat, lng, address } }
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Send message via NUI API with metadata
    messagesAPI.send(currentChatContact.phoneNumber, 'Location', 'location', { location: { lat, lng, address } });
    
    setShowLocationPicker(false);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // In production: Start voice recording
    console.log('Voice recording started');
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // In production: Stop voice recording and send
    console.log('Voice recording stopped');
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
    setCurrentChatContact(contact);
    setMessages([{
      id: Date.now().toString(),
      sender: 'me',
      receiver: contact.phoneNumber,
      content: newMessageForm.message.trim(),
      timestamp: 'now',
      isOutgoing: true,
      type: 'text'
    }]);
    
    // Send message via NUI API with metadata
    messagesAPI.send(contact.phoneNumber, newMessageForm.message.trim(), 'text');
    
    setNewMessageForm({ phoneNumber: '', message: '' });
    setShowNewMessage(false);
  };

  const callContact = (contact: Contact) => {
    if (onNavigateToContacts) {
      onNavigateToContacts({
        id: contact.id,
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        favorite: false,
        avatar: undefined
      });
    } else {
      console.log('Calling contact:', contact.phoneNumber);
      // In production: TriggerServerEvent('gg-phone:server:startCall', contact.phoneNumber)
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phoneNumber.includes(searchQuery);
    return matchesSearch;
  });

  // Chat View
  if (currentChatContact) {
    return (
      <div className="absolute inset-0 bg-oneui-dark flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 mt-2">
          <button 
            className="oneui-button p-2 -ml-2" 
            onClick={() => setCurrentChatContact(null)}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {getInitials(currentChatContact.name)}
              </span>
            </div>
            <div>
              <h3 className="text-white font-medium">{currentChatContact.name}</h3>
              <p className="text-white/60 text-sm">{currentChatContact.phoneNumber}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              className="oneui-button p-2 bg-green-500/20 rounded-full"
              onClick={() => callContact(currentChatContact)}
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
                {message.type === 'emoji' && (
                  <div className="text-2xl">{message.metadata?.emoji}</div>
                )}
                {message.type === 'gif' && message.metadata?.gifUrl && (
                  <img src={message.metadata.gifUrl} alt="GIF" className="w-full rounded" />
                )}
                {message.type === 'photo' && message.metadata?.photoUrl && (
                  <img src={message.metadata.photoUrl} alt="Photo" className="w-full rounded" />
                )}
                {message.type === 'location' && message.metadata?.location && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-red-400" />
                      <span className="text-sm">Location shared</span>
                    </div>
                    <p className="text-xs text-white/70">{message.metadata.location.address}</p>
                  </div>
                )}
                {message.type === 'text' && (
                  <p>{message.content}</p>
                )}
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
          {/* Attachment Options */}
          <div className="flex items-center space-x-2 mb-3">
            <button
              className="oneui-button p-2 text-white/70 hover:text-white"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              className="oneui-button p-2 text-white/70 hover:text-white"
              onClick={() => setShowGifPicker(!showGifPicker)}
            >
              <Image className="w-5 h-5" />
            </button>
            <button
              className="oneui-button p-2 text-white/70 hover:text-white"
              onClick={() => setShowPhotoPicker(!showPhotoPicker)}
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              className="oneui-button p-2 text-white/70 hover:text-white"
              onClick={() => setShowLocationPicker(!showLocationPicker)}
            >
              <MapPin className="w-5 h-5" />
            </button>
            <button
              className={`oneui-button p-2 rounded-full transition-colors ${
                isRecording ? 'bg-red-500 text-white' : 'text-white/70 hover:text-white'
              }`}
              onMouseDown={startVoiceRecording}
              onMouseUp={stopVoiceRecording}
              onMouseLeave={stopVoiceRecording}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="bg-white/10 rounded-lg p-3 mb-3">
              <div className="grid grid-cols-8 gap-2">
                {['😀', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🤔', '😢', '😡', '🥳', '🤩', '😴', '🤗', '😋', '🤫'].map((emoji) => (
                  <button
                    key={emoji}
                    className="text-2xl hover:scale-110 transition-transform"
                    onClick={() => sendEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GIF Picker */}
          {showGifPicker && (
            <div className="bg-white/10 rounded-lg p-3 mb-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
                  'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
                  'https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif'
                ].map((gifUrl, index) => (
                  <button
                    key={index}
                    className="w-full h-20 bg-white/20 rounded overflow-hidden hover:scale-105 transition-transform"
                    onClick={() => sendGif(gifUrl)}
                  >
                    <img src={gifUrl} alt="GIF" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Photo Picker */}
          {showPhotoPicker && (
            <div className="bg-white/10 rounded-lg p-3 mb-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  'https://picsum.photos/200/200?random=1',
                  'https://picsum.photos/200/200?random=2',
                  'https://picsum.photos/200/200?random=3'
                ].map((photoUrl, index) => (
                  <button
                    key={index}
                    className="w-full h-20 bg-white/20 rounded overflow-hidden hover:scale-105 transition-transform"
                    onClick={() => sendPhoto(photoUrl)}
                  >
                    <img src={photoUrl} alt="Photo" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location Picker */}
          {showLocationPicker && (
            <div className="bg-white/10 rounded-lg p-3 mb-3">
              <div className="space-y-2">
                <button
                  className="w-full p-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  onClick={() => sendLocation(40.7128, -74.0060, 'New York, NY, USA')}
                >
                  📍 New York, NY, USA
                </button>
                <button
                  className="w-full p-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  onClick={() => sendLocation(34.0522, -118.2437, 'Los Angeles, CA, USA')}
                >
                  📍 Los Angeles, CA, USA
                </button>
                <button
                  className="w-full p-3 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                  onClick={() => sendLocation(51.5074, -0.1278, 'London, UK')}
                >
                  📍 London, UK
                </button>
              </div>
            </div>
          )}

          {/* Text Input */}
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
function setCurrentChatContact(contact: Contact) {
  throw new Error('Function not implemented.');
}

