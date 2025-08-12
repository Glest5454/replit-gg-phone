import { ArrowLeft, Plus, Search, Phone, MessageCircle, Star, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ContactsAppProps {
  onBack: () => void;
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  favorite: boolean;
  lastCall?: string;
}

export const ContactsApp = ({ onBack }: ContactsAppProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  const callContact = (contact: Contact) => {
    // This would trigger the phone call in FiveM with pma-voice integration
    console.log('Calling contact:', contact.phoneNumber);
    // TriggerServerEvent('phone:call:start', contact.phoneNumber)
  };

  const messageContact = (contact: Contact) => {
    // This would open the messaging interface
    console.log('Messaging contact:', contact.phoneNumber);
    // Navigate to messages with this contact
  };

  const toggleFavorite = (contactId: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, favorite: !contact.favorite }
        : contact
    ));
    // TriggerServerEvent('phone:contacts:toggleFavorite', contactId)
  };

  const deleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
    setSelectedContact(null);
    // TriggerServerEvent('phone:contacts:delete', contactId)
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.phoneNumber.includes(searchQuery);
    const matchesTab = activeTab === 'all' || (activeTab === 'favorites' && contact.favorite);
    return matchesSearch && matchesTab;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (selectedContact) {
    return (
      <div className="absolute inset-0 contacts-app flex flex-col">
        {/* Contact Details Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
          <button 
            className="oneui-button p-2 -ml-2" 
            onClick={() => setSelectedContact(null)}
            data-testid="contact-detail-back"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Contact</h1>
          <button 
            className="oneui-button p-2"
            data-testid="contact-edit"
          >
            <Edit className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Contact Avatar and Info */}
        <div className="p-6 text-center border-b border-white/10">
          <div className="w-24 h-24 bg-samsung-blue rounded-full flex items-center justify-center mx-auto mb-4">
            {selectedContact.avatar ? (
              <img src={selectedContact.avatar} alt={selectedContact.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white font-semibold text-2xl">{getInitials(selectedContact.name)}</span>
            )}
          </div>
          <h2 className="text-white text-2xl font-semibold mb-2">{selectedContact.name}</h2>
          <p className="text-white/70 text-lg">{selectedContact.phoneNumber}</p>
          {selectedContact.lastCall && (
            <p className="text-white/50 text-sm mt-2">Last call: {selectedContact.lastCall}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-b border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="oneui-button bg-samsung-green text-white py-4 rounded-samsung-sm font-medium flex items-center justify-center space-x-2"
              onClick={() => callContact(selectedContact)}
              data-testid="contact-call"
            >
              <Phone className="w-5 h-5" />
              <span>Call</span>
            </button>
            <button 
              className="oneui-button bg-samsung-blue text-white py-4 rounded-samsung-sm font-medium flex items-center justify-center space-x-2"
              onClick={() => messageContact(selectedContact)}
              data-testid="contact-message"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </button>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm"
              onClick={() => toggleFavorite(selectedContact.id)}
              data-testid="toggle-favorite"
            >
              <div className="flex items-center space-x-3">
                <Star className={`w-5 h-5 ${selectedContact.favorite ? 'text-yellow-400 fill-current' : 'text-white/60'}`} />
                <span className="text-white">Add to Favorites</span>
              </div>
            </button>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-surface-dark/30 rounded-samsung-sm"
              data-testid="block-contact"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <span className="text-white">Block Contact</span>
              </div>
            </button>
            
            <button 
              className="oneui-button w-full flex items-center justify-between p-4 bg-red-500/20 rounded-samsung-sm"
              onClick={() => deleteContact(selectedContact.id)}
              data-testid="delete-contact"
            >
              <div className="flex items-center space-x-3">
                <Trash2 className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Delete Contact</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 contacts-app flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="contacts-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Contacts</h1>
        <button 
          className="oneui-button p-2"
          data-testid="add-contact"
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
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-dark/50 text-white placeholder-white/60 pl-10 pr-4 py-3 rounded-samsung-sm border border-white/10 outline-none focus:border-samsung-blue"
            data-testid="contacts-search"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          className={`flex-1 py-4 text-center transition-colors duration-200 ${
            activeTab === 'all' 
              ? 'text-samsung-blue border-b-2 border-samsung-blue' 
              : 'text-white/70'
          }`}
          onClick={() => setActiveTab('all')}
          data-testid="tab-all"
        >
          All Contacts
        </button>
        <button
          className={`flex-1 py-4 text-center transition-colors duration-200 ${
            activeTab === 'favorites' 
              ? 'text-samsung-blue border-b-2 border-samsung-blue' 
              : 'text-white/70'
          }`}
          onClick={() => setActiveTab('favorites')}
          data-testid="tab-favorites"
        >
          Favorites
        </button>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          <div className="p-4 space-y-2">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                className="oneui-button w-full flex items-center space-x-4 p-4 bg-surface-dark/30 rounded-samsung-sm hover:bg-surface-dark/50 transition-colors"
                onClick={() => setSelectedContact(contact)}
                data-testid={`contact-${contact.id}`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-samsung-blue rounded-full flex items-center justify-center">
                    {contact.avatar ? (
                      <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold">{getInitials(contact.name)}</span>
                    )}
                  </div>
                  {contact.favorite && (
                    <Star className="w-4 h-4 text-yellow-400 fill-current absolute -top-1 -right-1 bg-oneui-dark rounded-full p-0.5" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-medium">{contact.name}</h3>
                  <p className="text-white/60 text-sm">{contact.phoneNumber}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="oneui-button p-2 bg-samsung-green/20 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      callContact(contact);
                    }}
                    data-testid={`quick-call-${contact.id}`}
                  >
                    <Phone className="w-4 h-4 text-samsung-green" />
                  </button>
                  <button 
                    className="oneui-button p-2 bg-samsung-blue/20 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      messageContact(contact);
                    }}
                    data-testid={`quick-message-${contact.id}`}
                  >
                    <MessageCircle className="w-4 h-4 text-samsung-blue" />
                  </button>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="w-16 h-16 bg-surface-dark/50 rounded-samsung mx-auto mb-4 flex items-center justify-center">
                👥
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'No contacts found' : 'No contacts yet'}
              </h3>
              <p className="text-sm mb-4">
                {searchQuery 
                  ? 'Try a different search term' 
                  : 'Add contacts to start calling and messaging'
                }
              </p>
              {!searchQuery && (
                <button 
                  className="oneui-button bg-samsung-blue text-white px-6 py-2 rounded-samsung-sm font-medium"
                  data-testid="add-first-contact"
                >
                  Add Contact
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
