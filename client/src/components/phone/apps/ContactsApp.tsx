import { ArrowLeft, Plus, Search, Phone, MessageCircle, Star, Edit, Trash2, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, Clock, PhoneIncoming, PhoneOutgoing, PhoneMissed, Trash2 as TrashIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ContactsAppProps {
  onBack: () => void;
  onNavigateToMessages?: (contact: Contact) => void;
}

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  avatar?: string;
  favorite: boolean;
  lastCall?: string;
}

interface CallLog {
  id: string;
  contact: Contact;
  type: "incoming" | "outgoing" | "missed";
  duration?: string;
  timestamp: Date;
}

interface ActiveCall {
  contact: Contact;
  duration: number;
  isMuted: boolean;
  isSpeaker: boolean;
  status: "connecting" | "active" | "ended";
}

export const ContactsApp = ({ onBack, onNavigateToMessages }: ContactsAppProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'dialer' | 'recent'>('all');
  const [dialNumber, setDialNumber] = useState('');
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);

  const callContact = (contact: Contact) => {
    // This would trigger the phone call in FiveM with pma-voice integration
    console.log('Calling contact:', contact.phoneNumber);
    // TriggerServerEvent('phone:call:start', contact.phoneNumber)
    
    // Start active call
    setActiveCall({
      contact: contact,
      duration: 0,
      isMuted: false,
      isSpeaker: false,
      status: "connecting",
    });

    // Simulate call connecting
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: "active" } : null);
    }, 2000);

    // Add to call log
    const newLog: CallLog = {
      id: Date.now().toString(),
      contact: contact,
      type: "outgoing",
      timestamp: new Date(),
    };
    setCallLogs(prev => [newLog, ...prev]);
  };

  const makeCall = (number: string) => {
    const callContact = {
      id: "unknown",
      name: number,
      phoneNumber: number,
      avatar: undefined,
      favorite: false,
    };

    setActiveCall({
      contact: callContact,
      duration: 0,
      isMuted: false,
      isSpeaker: false,
      status: "connecting",
    });

    // Simulate call connecting
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: "active" } : null);
    }, 2000);

    // Add to call log
    const newLog: CallLog = {
      id: Date.now().toString(),
      contact: callContact,
      type: "outgoing",
      timestamp: new Date(),
    };
    setCallLogs(prev => [newLog, ...prev]);
  };

  const endCall = () => {
    if (activeCall) {
      // Update call log with duration
      setCallLogs(prev => prev.map(log => 
        log.id === callLogs[0]?.id && log.contact.id === activeCall.contact.id
          ? { ...log, duration: formatDuration(activeCall.duration) }
          : log
      ));

      setActiveCall(null);
    }
  };

  const toggleMute = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
    }
  };

  const toggleSpeaker = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, isSpeaker: !prev.isSpeaker } : null);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCallTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getCallIcon = (type: CallLog["type"]) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className="h-4 w-4 text-green-600" />;
      case "outgoing":
        return <PhoneOutgoing className="h-4 w-4 text-blue-600" />;
      case "missed":
        return <PhoneMissed className="h-4 w-4 text-red-600" />;
    }
  };

  const addDigit = (digit: string) => {
    setDialNumber(prev => prev + digit);
  };

  const removeDigit = () => {
    setDialNumber(prev => prev.slice(0, -1));
  };

  const clearDialer = () => {
    setDialNumber("");
  };

  const deleteCallLog = (logId: string) => {
    setCallLogs(prev => prev.filter(log => log.id !== logId));
  };

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall && activeCall.status === "active") {
      interval = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  // Load mock data
  useEffect(() => {
    // Mock contacts
    setContacts([
      { id: "c1", name: "John Doe", phoneNumber: "+1 555-0123", favorite: true },
      { id: "c2", name: "Jane Smith", phoneNumber: "+1 555-0456", favorite: false },
      { id: "c3", name: "Emergency Services", phoneNumber: "911", favorite: false },
      { id: "c4", name: "Pizza Palace", phoneNumber: "+1 555-7890", favorite: true },
    ]);

    // Mock call logs
    setCallLogs([
      {
        id: "1",
        contact: { id: "c1", name: "John Doe", phoneNumber: "+1 555-0123", favorite: true },
        type: "outgoing",
        duration: "2:15",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: "2",
        contact: { id: "c2", name: "Jane Smith", phoneNumber: "+1 555-0456", favorite: false },
        type: "missed",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
    ]);
  }, []);

  // Check if we should auto-navigate to dialer for a specific contact
  useEffect(() => {
    // This would be triggered when navigating from MessagesApp
    // For now, we'll check if there's a specific contact to call
    const urlParams = new URLSearchParams(window.location.search);
    const callContact = urlParams.get('call');
    if (callContact) {
      setActiveTab('dialer');
      setDialNumber(callContact);
    }
  }, []);

  const messageContact = (contact: Contact) => {
    if (onNavigateToMessages) {
      onNavigateToMessages(contact);
    } else {
      console.log('Messaging contact:', contact.phoneNumber);
    }
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

  const filteredCallLogs = callLogs.filter(log => {
    const matchesSearch = log.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.contact.phoneNumber.includes(searchQuery);
    return matchesSearch;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (activeCall) {
    return (
      <div className="absolute inset-0 contacts-app flex flex-col bg-gray-900">
        {/* Call Status */}
        <div className="text-center mb-8 mt-20">
          <div className="w-32 h-32 bg-samsung-blue rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-4xl font-bold text-white">
              {activeCall.contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-white">{activeCall.contact.name}</h2>
          <p className="text-gray-400 mb-2">{activeCall.contact.phoneNumber}</p>
          <p className="text-lg text-white">
            {activeCall.status === "connecting" ? "Connecting..." : formatDuration(activeCall.duration)}
          </p>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <button
            onClick={toggleMute}
            className={`oneui-button w-16 h-16 rounded-full transition-colors ${
              activeCall.isMuted 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {activeCall.isMuted ? (
              <MicOff className="h-6 w-6 text-white mx-auto" />
            ) : (
              <Mic className="h-6 w-6 text-white mx-auto" />
            )}
          </button>

          <button
            onClick={toggleSpeaker}
            className={`oneui-button w-16 h-16 rounded-full transition-colors ${
              activeCall.isSpeaker 
                ? "bg-samsung-blue hover:bg-samsung-blue/90" 
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {activeCall.isSpeaker ? (
              <Volume2 className="h-6 w-6 text-white mx-auto" />
            ) : (
              <VolumeX className="h-6 w-6 text-white mx-auto" />
            )}
          </button>
        </div>

        {/* End Call Button */}
        <button
          onClick={endCall}
          className="oneui-button w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 mx-auto"
        >
          <PhoneOff className="h-8 w-8 text-white mx-auto" />
        </button>
      </div>
    );
  }

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
          <Search className="w-5 h-5 text-black/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder= {activeTab === 'recent' ? 'Search recent calls...' : 'Search contacts...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-dark/50 text-black placeholder-white/60 pl-10 pr-4 py-3 rounded-samsung-sm border border-white/10 outline-none focus:border-samsung-blue"
            data-testid="contacts-search"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          className={`flex-1 py-2 text-center transition-colors duration-200 ${
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
          className={`flex-1 py-2 text-center transition-colors duration-200 ${
            activeTab === 'favorites' 
              ? 'text-samsung-blue border-b-2 border-samsung-blue' 
              : 'text-white/70'
          }`}
          onClick={() => setActiveTab('favorites')}
          data-testid="tab-favorites"
        >
          Favorites
        </button>
        <button
          className={`flex-1 py-2 text-center transition-colors duration-200 ${
            activeTab === 'dialer' 
              ? 'text-samsung-blue border-b-2 border-samsung-blue' 
              : 'text-white/70'
          }`}
          onClick={() => setActiveTab('dialer')}
          data-testid="tab-dialer"
        >
          Dialer
        </button>
        <button
          className={`flex-1 py-2 text-center transition-colors duration-200 ${
            activeTab === 'recent' 
              ? 'text-samsung-blue border-b-2 border-samsung-blue' 
              : 'text-white/70'
          }`}
          onClick={() => setActiveTab('recent')}
          data-testid="tab-recent"
        >
          Recent
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'all' || activeTab === 'favorites' ? (
          // Contacts List
          filteredContacts.length > 0 ? (
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
          )
        ) : activeTab === 'dialer' ? (
          // Dialer
          <div className="p-4">
            {/* Number Display */}
            <div className="text-center mb-4">
              <div className="text-2xl text-white font-mono bg-surface-dark/30 rounded-lg p-4 min-h-[3rem] flex items-center justify-center">
                {dialNumber || 'Enter number...'}
              </div>
            </div>

            {/* Dialer Pad */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
                <button
                  key={digit}
                  onClick={() => addDigit(digit)}
                  className="oneui-button h-12 text-xl font-semibold bg-surface-dark/30 text-white rounded-samsung-sm hover:bg-surface-dark/50 transition-colors"
                >
                  {digit}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              {dialNumber && (
                <button
                  onClick={removeDigit}
                  className="oneui-button w-14 h-14 rounded-full bg-surface-dark/30 text-white hover:bg-surface-dark/50 transition-colors"
                >
                  ⌫
                </button>
              )}
              
              <button
                onClick={() => makeCall(dialNumber)}
                disabled={!dialNumber}
                className="oneui-button w-14 h-14 rounded-full bg-samsung-green hover:bg-samsung-green/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <PhoneCall className="h-6 w-6 text-white ml-3.5" />
              </button>

              {dialNumber && (
                <button
                  onClick={clearDialer}
                  className="oneui-button w-12 h-12 rounded-full bg-surface-dark/30 text-white hover:bg-surface-dark/50 transition-colors"
                >
                  <PhoneOff className="h-6 w-6 ml-2.5" />
                </button>
              )}
            </div>
          </div>
                 ) : activeTab === 'recent' ? (
           // Recent Calls
           <div className="p-4">
             <h2 className="text-lg font-semibold text-white mb-4">Recent Calls</h2>
             {filteredCallLogs.length > 0 ? (
               <div className="space-y-2">
                 {filteredCallLogs.map((log) => (
                  <div key={log.id} className="bg-surface-dark/30 rounded-samsung-sm p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getCallIcon(log.type)}
                      <div>
                        <h3 className="font-medium text-white">{log.contact.name}</h3>
                        <p className="text-sm text-white/60">{log.contact.phoneNumber}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-white/40" />
                          <span className="text-xs text-white/50">{formatCallTime(log.timestamp)}</span>
                          {log.duration && (
                            <>
                              <span className="text-xs text-white/40">•</span>
                              <span className="text-xs text-white/50">{log.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => callContact(log.contact)}
                        className="oneui-button p-2 bg-samsung-green/20 rounded-full hover:bg-samsung-green/30 transition-colors"
                      >
                        <PhoneCall className="h-4 w-4 text-samsung-green" />
                      </button>
                      <button
                        onClick={() => deleteCallLog(log.id)}
                        className="oneui-button p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
                         ) : (
               <div className="text-center py-8">
                 <Phone className="h-12 w-12 text-white/40 mx-auto mb-4" />
                 <p className="text-white/60">
                   {searchQuery ? 'No recent calls found' : 'No recent calls'}
                 </p>
               </div>
             )}
          </div>
        ) : null}
      </div>
    </div>
  );
};