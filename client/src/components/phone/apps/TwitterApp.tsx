import { ArrowLeft, Edit3, Image, FileText, BarChart3, MapPin, MessageCircle, Repeat, Heart, Share, User, LogOut, Settings, Camera, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TwitterAppProps {
  onBack: () => void;
}

interface Tweet {
  id: string;
  author: string;
  username: string;
  time: string;
  content: string;
  imageUrl?: string;
  location?: string;
  likes: number;
  retweets: number;
  replies: number;
  verified?: boolean;
  avatar: string;
}

interface TwitterAccount {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
}

export const TwitterApp = ({ onBack }: TwitterAppProps) => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'main' | 'profile'>('main');
  const [tweetContent, setTweetContent] = useState('');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [currentAccount, setCurrentAccount] = useState<TwitterAccount | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    displayName: '' 
  });
  const [profileForm, setProfileForm] = useState({ 
    displayName: 'Test User', 
    bio: 'This is a test account for development', 
    avatar: 'TU' 
  });
  const [passwordForm, setPasswordForm] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  // Mock test data for development
  const mockTestAccount: TwitterAccount = {
    id: '1',
    username: '123456',
    displayName: 'Test User',
    avatar: 'TU',
    bio: 'This is a test account for development',
    verified: false,
    followersCount: 42,
    followingCount: 15
  };

  const mockTestTweets: Tweet[] = [
  {
    id: '1',
      author: 'Test User',
      username: '@123456',
    time: '2h',
      content: 'Just testing the Twitter app! 🚀 This is a mock tweet for development purposes.',
      likes: 5,
      retweets: 2,
      replies: 1,
      avatar: 'TU'
  },
  {
    id: '2',
      author: 'Test User',
      username: '@123456',
    time: '4h',
      content: 'Another test tweet to see how the UI looks with multiple posts. The app is coming along nicely! 📱',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
      likes: 12,
      retweets: 3,
      replies: 2,
      avatar: 'TU'
    },
    {
      id: '3',
      author: 'Test User',
      username: '@123456',
      time: '6h',
      content: 'Testing the like and retweet functionality. Everything should work smoothly! 👍',
      location: 'Los Santos',
      likes: 8,
      retweets: 1,
      replies: 0,
      avatar: 'TU'
    }
  ];

  // Load tweets on mount
  useEffect(() => {
    if (currentView === 'main') {
      // For development, use mock data instead of fetching
      setTweets(mockTestTweets);
      setCurrentAccount(mockTestAccount);
    }
  }, [currentView]);

  const fetchTweets = () => {
    fetch('https://nui-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'getTweets' })
    });
  };

  // Handle NUI messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { action, ...data } = event.data;
      
      switch (action) {
        case 'tweetsLoaded':
          setTweets(data.tweets || []);
          break;
        case 'twitterLoggedIn':
          setCurrentAccount(data.account);
          setCurrentView('main');
          break;
        case 'twitterRegistered':
          setCurrentView('login');
          break;
        case 'profileUpdated':
          if (currentAccount) {
            setCurrentAccount({ ...currentAccount, ...data.profile });
          }
          setShowProfileEditor(false);
          break;
        case 'passwordChanged':
          setShowPasswordChange(false);
          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
          break;
        case 'tweetPosted':
          setTweetContent('');
          setShowComposer(false);
          fetchTweets();
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentAccount]);

  const handleLogin = () => {
    if (!loginForm.username || !loginForm.password) return;
    
    fetch('https://nui-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'twitterLogin',
        username: loginForm.username,
        password: loginForm.password
      })
    });
  };

  const handleRegister = () => {
    if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.displayName) return;
  
    fetch('https://nui-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'twitterRegister',
        ...registerForm
      })
    });
  };

  const handlePostTweet = () => {
    if (!tweetContent.trim()) return;
    
    // For development, add tweet to mock data
    const newTweet: Tweet = {
      id: Date.now().toString(),
      author: currentAccount?.displayName || 'Test User',
      username: `@${currentAccount?.username || '123456'}`,
      time: 'now',
      content: tweetContent,
      likes: 0,
      retweets: 0,
      replies: 0,
      avatar: currentAccount?.avatar || 'TU'
    };
    
    setTweets([newTweet, ...tweets]);
    setTweetContent('');
    setShowComposer(false);
    
    // In production, this would call the server
    // fetch('https://nui-callback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     action: 'postTweet',
    //     content: tweetContent,
    //     imageUrl: null,
    //     location: null
    //   })
    // });
  };

  const handleUpdateProfile = () => {
    if (!profileForm.displayName) return;
    
    // For development, update mock data
    if (currentAccount) {
      const updatedAccount = {
        ...currentAccount,
        displayName: profileForm.displayName,
        bio: profileForm.bio,
        avatar: profileForm.avatar
      };
      setCurrentAccount(updatedAccount);
    }
    
    setShowProfileEditor(false);
    
    // In production, this would call the server
    // fetch('https://nui-callback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     action: 'updateTwitterProfile',
    //     ...profileForm
    //   })
    // });
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return;
    
    fetch('https://nui-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'changeTwitterPassword',
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
    });
  };

  const handleLogout = () => {
    fetch('https://nui-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'twitterLogout' })
    });
    setCurrentAccount(null);
    setCurrentView('login');
  };

  const handleLike = (tweetId: string) => {
    // For development, update mock data
    setTweets(tweets.map(tweet => {
      if (tweet.id === tweetId) {
        return { ...tweet, likes: tweet.likes + 1 };
      }
      return tweet;
    }));
    
    // In production, this would call the server
    // fetch('https://nui-callback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     action: 'likeTweet',
    //     tweetId 
    //   })
    // });
  };

  const handleRetweet = (tweetId: string) => {
    // For development, update mock data
    setTweets(tweets.map(tweet => {
      if (tweet.id === tweetId) {
        return { ...tweet, retweets: tweet.retweets + 1 };
      }
      return tweet;
    }));
    
    // In production, this would call the server
    // fetch('https://nui-callback', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     action: 'retweetTweet',
    //     tweetId 
    //   })
    // });
  };

  // Login View
  if (currentView === 'login') {
    return (
      <div className="absolute inset-0 bg-oneui-dark flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 mt-2">
          <button className="oneui-button p-2 -ml-2" onClick={onBack}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">T</div>
            <h1 className="text-white text-lg font-semibold">Warble</h1>
          </div>
          <div className="w-10" />
        </div>
        
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">T</span>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Welcome to Warble</h2>
              <p className="text-white/60">Sign in to your account</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <button
                className="w-full bg-blue-400 text-white py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
                onClick={handleLogin}
              >
                Sign In
              </button>
            </div>
            
            <div className="text-center mt-6">
              <button
                className="text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => setCurrentView('register')}
              >
                Don't have an account? Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Register View
  if (currentView === 'register') {
    return (
      <div className="absolute inset-0 bg-oneui-dark flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 mt-2">
          <button className="oneui-button p-2 -ml-2" onClick={() => setCurrentView('login')}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">T</div>
            <h1 className="text-white text-lg font-semibold">Create Account</h1>
          </div>
          <div className="w-10" />
        </div>
        
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">T</span>
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Join Warble</h2>
              <p className="text-white/60">Create your account</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Display Name"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={registerForm.displayName}
                onChange={(e) => setRegisterForm({ ...registerForm, displayName: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
              <button
                className="w-full bg-blue-400 text-white py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
                onClick={handleRegister}
              >
                Create Account
              </button>
            </div>
            
            <div className="text-center mt-6">
              <button
                className="text-blue-400 hover:text-blue-300 transition-colors"
                onClick={() => setCurrentView('login')}
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Profile View
  if (currentView === 'profile') {
    return (
      <div className="absolute inset-0 bg-oneui-dark flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10 mt-2">
          <button className="oneui-button p-2 -ml-2" onClick={() => setCurrentView('main')}>
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-lg font-semibold">Profile</h1>
          <div className="w-10" />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Profile Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{currentAccount?.avatar}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-white text-xl font-bold">{currentAccount?.displayName}</h2>
                <p className="text-blue-400">@{currentAccount?.username}</p>
                {currentAccount?.verified && (
                  <div className="inline-flex items-center space-x-1 mt-1">
                    <div className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-white/60 text-sm">Verified</span>
                  </div>
                )}
              </div>
            </div>
            
            {currentAccount?.bio && (
              <p className="text-white/80 mb-4">{currentAccount.bio}</p>
            )}
            
            <div className="flex space-x-6 text-white/60">
              <div>
                <span className="font-bold text-white">{currentAccount?.followingCount}</span> Following
              </div>
              <div>
                <span className="font-bold text-white">{currentAccount?.followersCount}</span> Followers
              </div>
            </div>
          </div>
          
          {/* Profile Actions */}
          <div className="p-6 space-y-4">
            <button
              className="w-full bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
              onClick={() => {
                if (currentAccount) {
                  setProfileForm({
                    displayName: currentAccount.displayName,
                    bio: currentAccount.bio || '',
                    avatar: currentAccount.avatar
                  });
                }
                setShowProfileEditor(true);
              }}
            >
              Edit Profile
            </button>
            
            <button
              className="w-full bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
              onClick={() => setShowPasswordChange(true)}
            >
              Change Password
            </button>
            
            <button
              className="w-full bg-red-500/20 text-red-400 py-3 rounded-lg font-medium hover:bg-red-500/30 transition-colors"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Profile Editor Modal */}
        {showProfileEditor && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6">
            <div className="bg-oneui-dark rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Edit Profile</h3>
                <button
                  className="oneui-button p-2"
                  onClick={() => setShowProfileEditor(false)}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Display Name"
                  className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={profileForm.displayName}
                  onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                />
                <textarea
                  placeholder="Bio"
                  rows={3}
                  className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Avatar (2 characters)"
                  maxLength={2}
                  className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value.toUpperCase() })}
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  className="flex-1 bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
                  onClick={() => setShowProfileEditor(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-blue-400 text-white py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
                  onClick={handleUpdateProfile}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Password Change Modal */}
        {showPasswordChange && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6">
            <div className="bg-oneui-dark rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Change Password</h3>
                <button
                  className="oneui-button p-2"
                  onClick={() => setShowPasswordChange(false)}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  className="flex-1 bg-white/10 text-white py-3 rounded-lg font-medium hover:bg-white/20 transition-colors"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-blue-400 text-white py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
                  onClick={handleChangePassword}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Twitter View
  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 mt-2">
        <button className="oneui-button p-2 -ml-2" onClick={onBack}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">T</div>
          <h1 className="text-white text-lg font-semibold">Warble</h1>
        </div>
        <div className="flex items-center space-x-2">
        <button 
          className="oneui-button p-2"
            onClick={() => setShowComposer(true)}
        >
          <Edit3 className="w-5 h-5 text-white" />
        </button>
          <button 
            className="oneui-button p-2"
            onClick={() => setCurrentView('profile')}
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      {/* Tweet Composer Modal */}
      {showComposer && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-oneui-dark rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">New Warble</h3>
              <button
                className="oneui-button p-2"
                onClick={() => setShowComposer(false)}
              >
                <X className="w-5 h-5 text-white" />
              </button>
          </div>
            
            <div className="space-y-4">
            <textarea 
                className="w-full bg-white/10 text-white placeholder-white/50 resize-none border-none outline-none p-4 rounded-lg"
              placeholder="What's happening?"
                rows={4}
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 text-blue-400">
                  <button className="oneui-button">
                  <Image className="w-5 h-5" />
                </button>
                  <button className="oneui-button">
                  <FileText className="w-5 h-5" />
                </button>
                  <button className="oneui-button">
                  <BarChart3 className="w-5 h-5" />
                </button>
                  <button className="oneui-button">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
              <button 
                  className="bg-blue-400 text-white px-6 py-2 rounded-full font-medium disabled:opacity-50 hover:bg-blue-500 transition-colors"
                disabled={!tweetContent.trim()}
                  onClick={handlePostTweet}
              >
                Warble
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
      
      {/* Tweet Feed */}
      <div className="flex-1 overflow-y-auto">
        {tweets.map((tweet) => (
          <div 
            key={tweet.id}
            className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
          >
            <div className="flex space-x-3">
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{tweet.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-white font-medium">{tweet.author}</span>
                  <span className="text-blue-400">@{tweet.username}</span>
                  {tweet.verified && (
                    <div className="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <span className="text-white/50 text-sm">·</span>
                  <span className="text-white/50 text-sm">{tweet.time}</span>
                </div>
                <p className="text-white mb-3">{tweet.content}</p>
                {tweet.imageUrl && (
                  <div className="rounded-lg overflow-hidden mb-3">
                    <img 
                      src={tweet.imageUrl} 
                      alt="Tweet image" 
                      className="w-full h-32 object-cover" 
                    />
                  </div>
                )}
                {tweet.location && (
                  <div className="flex items-center space-x-1 text-blue-400 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{tweet.location}</span>
                  </div>
                )}
                <div className="flex justify-between max-w-md text-white/60">
                  <button 
                    className="oneui-button flex items-center space-x-2 hover:text-blue-400 transition-colors"
                    onClick={() => handleLike(tweet.id)}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{tweet.likes}</span>
                  </button>
                  <button 
                    className="oneui-button flex items-center space-x-2 hover:text-green-400 transition-colors"
                    onClick={() => handleRetweet(tweet.id)}
                  >
                    <Repeat className="w-4 h-4" />
                    <span className="text-sm">{tweet.retweets}</span>
                  </button>
                  <button 
                    className="oneui-button flex items-center space-x-2 hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{tweet.replies}</span>
                  </button>
                  <button 
                    className="oneui-button hover:text-blue-400 transition-colors"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
