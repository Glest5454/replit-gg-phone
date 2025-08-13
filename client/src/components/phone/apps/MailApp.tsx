import { ArrowLeft,
   Plus, Search, Mail, Star, Archive, Trash2, Send, Paperclip, X, Edit, User
   } from 'lucide-react';
import { useState, useEffect } from 'react';
import { mailAPI, NUIManager } from '@/utils/nui';

interface MailAppProps {
  onBack: () => void;
}

interface MailAccount {
  id: string;
  email: string;
  password: string;
  display_name: string;
  created_at: string;
}

interface Email {
  id: string;
  from_email: string;
  to_email: string;
  subject: string;
  content: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  created_at: string;
  sender?: MailAccount;
}

export const MailApp = ({ onBack }: MailAppProps) => {
  const [currentAccount, setCurrentAccount] = useState<MailAccount | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'starred' | 'archived'>('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Account creation form
  const [newAccountData, setNewAccountData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  // Compose email form
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    content: ''
  });
    //add mock data email addres : test@test.com , password : 123456
  const mockTestAccount = { //test@test.com , password : 123456
    id: '1',
    email: 'test@test.com',
    password: '123456',
    display_name: 'Test Account',
    created_at: '2021-01-01'
  };

  useEffect(() => {
    if (currentAccount) {
      setCurrentAccount(mockTestAccount);
    }
  }, [currentAccount]); 
  useEffect(() => {
    if (currentAccount?.email === mockTestAccount.email) {
      setEmails([
        {
          id: '101',
          from_email: 'welcome@mail.com',
          to_email: mockTestAccount.email,
          subject: 'Welcome!',
          content: 'This is your first mock email.',
          is_read: false,
          is_starred: false,
          is_archived: false,
          created_at: new Date().toISOString(),
          sender: { ...mockTestAccount }
        }
      ]);
    }
  }, [currentAccount]);
  useEffect(() => {
    // Setup NUI callbacks
    const handleMailAccountCreated = (data: { account: MailAccount }) => {
      setCurrentAccount(data.account);
      setIsCreatingAccount(false);
      setNewAccountData({ email: '', password: '', displayName: '' });
      // Load emails after account creation
      mailAPI.getEmails();
    };

    const handleMailAccountLoggedIn = (data: { account: MailAccount }) => {
      setCurrentAccount(data.account);
      // Load emails after login
      mailAPI.getEmails();
    };

    const handleEmailsLoaded = (data: { emails: Email[] }) => {
      setEmails(data.emails);
    };

    const handleEmailSent = (data: { email: Email }) => {
      setEmails(prev => [data.email, ...prev]);
      setIsComposing(false);
      setComposeData({ to: '', subject: '', content: '' });
    };

    const handleNewEmail = (data: { email: Email }) => {
      setEmails(prev => [data.email, ...prev]);
    };

    const handleMailError = (data: { error: string }) => {
      console.error('Mail error:', data.error);
    };

    // Listen for NUI message events
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'mailAccountCreated') {
        handleMailAccountCreated(event.data);
      } else if (event.data.action === 'mailAccountLoggedIn') {
        handleMailAccountLoggedIn(event.data);
      } else if (event.data.action === 'emailsLoaded') {
        handleEmailsLoaded(event.data);
      } else if (event.data.action === 'mailSent') {
        handleEmailSent(event.data);
      } else if (event.data.action === 'newEmail') {
        handleNewEmail(event.data);
      } else if (event.data.action === 'mailError') {
        handleMailError(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCreateAccount = () => {
    if (newAccountData.email.trim() && newAccountData.password.trim() && newAccountData.displayName.trim()) {
      mailAPI.createAccount(
        newAccountData.email.trim(),
        newAccountData.password.trim(),
        newAccountData.displayName.trim()
      );
    }
  };

  const handleSendEmail = () => {
    if (composeData.to.trim() && composeData.subject.trim() && composeData.content.trim()) {
      mailAPI.send(
        composeData.to.trim(),
        composeData.subject.trim(),
        composeData.content.trim()
      );
    }
  };

  const markAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, is_read: true } : email
    ));
    // Note: Mark as read functionality would be handled by server
  };

  const toggleStar = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, is_starred: !email.is_starred } : email
    ));
    // Note: Toggle star functionality would be handled by server
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.from_email.toLowerCase().includes(searchQuery.toLowerCase());

    switch (activeTab) {
      case 'inbox':
        return matchesSearch && email.to_email === currentAccount?.email && !email.is_archived;
      case 'sent':
        return matchesSearch && email.from_email === currentAccount?.email;
      case 'starred':
        return matchesSearch && email.is_starred && !email.is_archived;
      case 'archived':
        return matchesSearch && email.is_archived;
      default:
        return matchesSearch;
    }
  });

  // Account Creation Screen
  if (isCreatingAccount) {
    return (
      <div className="absolute inset-0 bg-oneui-dark flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
          <button 
            className="oneui-button p-2 -ml-2" 
            onClick={() => setIsCreatingAccount(false)}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Create Mail Account</h1>
          <button 
            className="oneui-button p-2"
            onClick={() => setIsCreatingAccount(false)}
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">Create Mail Account</h2>
            <p className="text-white/60">Set up your email account to start sending and receiving emails</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={newAccountData.email}
                onChange={(e) => setNewAccountData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={newAccountData.password}
                onChange={(e) => setNewAccountData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                placeholder="Enter your display name"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={newAccountData.displayName}
                onChange={(e) => setNewAccountData(prev => ({ ...prev, displayName: e.target.value }))}
              />
            </div>
          </div>

          <button
            className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!currentAccount) {
    return (
      <div className="absolute inset-0 bg-oneui-dark flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
          <button 
            className="oneui-button p-2 -ml-2" 
            onClick={onBack}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Mail Login</h1>
          <div></div>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">Welcome to Mail</h2>
            <p className="text-white/60">Login to your existing account or create a new one</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={newAccountData.email}
                onChange={(e) => setNewAccountData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={newAccountData.password}
                onChange={(e) => setNewAccountData(prev => ({ ...prev, password: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
              onClick={() => {
                /*if (newAccountData.email.trim() && newAccountData.password.trim()) {
                  mailAPI.login(newAccountData.email.trim(), newAccountData.password.trim());
                }*/
                setCurrentAccount(mockTestAccount);
              }}
            >
              Login
            </button>
            <button
              className="w-full bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
              onClick={() => setIsCreatingAccount(true)}
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Compose Email Screen
  if (isComposing) {
    return (
      <div className="absolute inset-0 bg-oneui-dark flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
          <button 
            className="oneui-button p-2 -ml-2" 
            onClick={() => setIsComposing(false)}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Compose</h1>
          <button 
            onClick={handleSendEmail}
            disabled={!composeData.to.trim() || !composeData.subject.trim() || !composeData.content.trim()}
            className="bg-red-500 text-white px-4 py-2 rounded-samsung-sm font-medium disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </button>
        </div>

        <div className="flex-1 p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-white/60 text-sm">From:</span>
            <span className="text-white">{currentAccount.email}</span>
          </div>

          <div>
            <input
              type="email"
              value={composeData.to}
              onChange={(e) => setComposeData({...composeData, to: e.target.value})}
              placeholder="To: recipient@example.com"
              className="w-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-red-400 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              value={composeData.subject}
              onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
              placeholder="Subject"
              className="w-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-red-400 focus:outline-none"
            />
          </div>

          <div className="flex-1">
            <textarea
              value={composeData.content}
              onChange={(e) => setComposeData({...composeData, content: e.target.value})}
              placeholder="Write your message..."
              rows={12}
              className="w-full h-full p-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-red-400 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Email Detail View
  if (selectedEmail) {
    return (
      <div className="absolute inset-0 bg-oneui-dark flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
          <button 
            className="oneui-button p-2 -ml-2" 
            onClick={() => setSelectedEmail(null)}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Email</h1>
          <button 
            className="oneui-button p-2"
            onClick={() => toggleStar(selectedEmail.id)}
          >
            <Star className={`w-6 h-6 ${selectedEmail.is_starred ? 'text-yellow-400 fill-current' : 'text-white'}`} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-white text-xl font-semibold mb-2">{selectedEmail.subject}</h2>
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <span>From: {selectedEmail.from_email}</span>
                  <span>•</span>
                  <span>{formatDate(selectedEmail.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="text-white leading-relaxed whitespace-pre-wrap">
              {selectedEmail.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Mail List View
  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 mt-2">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="mail-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center space-x-2">
          <Mail className="w-6 h-6 text-red-400" />
          <h1 className="text-white text-lg font-semibold">Mail</h1>
        </div>
        <button 
          className="oneui-button p-2"
          onClick={() => setIsComposing(true)}
          data-testid="compose-email"
        >
          <Edit className="w-6 h-6 text-white" />
        </button>
      </div>
      
      {/* Account Info */}
      <div className="px-6 py-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {currentAccount.display_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{currentAccount.display_name}</p>
            <p className="text-white/60 text-sm">{currentAccount.email}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emails..."
            className="w-full pl-10 pr-4 py-3 bg-surface-dark text-white rounded-samsung-sm border border-white/10 focus:border-red-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Email Categories */}
      <div className="px-6 mb-4">
        <div className="flex bg-surface-dark rounded-samsung-sm p-1 space-x-1">
          {[
            { key: 'inbox', label: 'Inbox' },
            { key: 'sent', label: 'Sent' },
            { key: 'starred', label: 'Starred' },
            { key: 'archived', label: 'Archived' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-3 rounded-samsung-sm text-xs font-medium transition-colors ${
                activeTab === tab.key 
                  ? 'bg-red-500 text-white' 
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Emails List */}
      <div className="flex-1 px-6 overflow-y-auto">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-white/60 text-lg mb-2">No emails yet</p>
            <p className="text-white/40 text-sm">
              {activeTab === 'inbox' && 'Your inbox is empty'}
              {activeTab === 'sent' && 'No sent emails'}
              {activeTab === 'starred' && 'No starred emails'}
              {activeTab === 'archived' && 'No archived emails'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 pb-6">
            {filteredEmails.map((email) => (
              <button
                key={email.id}
                onClick={() => {
                  setSelectedEmail(email);
                  if (!email.is_read && email.to_email === currentAccount.email) {
                    markAsRead(email.id);
                  }
                }}
                className={`oneui-button w-full p-4 rounded-samsung-sm text-left ${
                  email.is_read ? 'bg-surface-dark/30' : 'bg-surface-dark/50'
                }`}
                data-testid={`email-${email.id}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {email.sender?.display_name?.charAt(0).toUpperCase() || 
                       email.from_email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium truncate ${email.is_read ? 'text-white/80' : 'text-white'}`}>
                        {email.sender?.display_name || email.from_email}
                      </span>
                      <div className="flex items-center space-x-2">
                        {email.is_starred && (
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        )}
                        <span className="text-white/40 text-xs">{formatDate(email.created_at)}</span>
                      </div>
                    </div>
                    <h3 className={`font-medium truncate mb-1 ${email.is_read ? 'text-white/70' : 'text-white'}`}>
                      {email.subject}
                    </h3>
                    <p className="text-white/50 text-sm line-clamp-2">
                      {email.content}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};