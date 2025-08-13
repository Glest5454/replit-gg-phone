import { ArrowLeft, Edit3, Image, FileText, BarChart3, MapPin, MessageCircle, Repeat, Heart, Share, User, LogOut, Settings, Camera, X, Search, Bell, Home, Hash, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

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
  const [currentTab, setCurrentTab] = useState<'home' | 'search' | 'notifications' | 'messages'>('home');
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
    displayName: '',
    confirmPassword: ''
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
      content: 'The new Twitter app design is looking fantastic! Love the modern UI and smooth animations. Can\'t wait to see more features! ✨',
      likes: 8,
      retweets: 1,
      replies: 0,
      avatar: 'TU'
    }
  ];

  useEffect(() => {
    setCurrentAccount(mockTestAccount);
    setTweets(mockTestTweets);
  }, []);

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      return;
    }
    setCurrentAccount({
      id: "user1",
      username: loginForm.username,
      displayName: loginForm.username,
      avatar: "U",
      verified: false,
      followersCount: 0,
      followingCount: 0
    });
    setCurrentView('main');
  };

  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      return;
    }
    setCurrentAccount({
      id: "user1",
      username: registerForm.username,
      displayName: registerForm.displayName,
      avatar: "U",
      verified: false,
      followersCount: 0,
      followingCount: 0
    });
    setCurrentView('main');
  };

  const handlePostTweet = () => {
    if (!tweetContent.trim()) return;
    
    const newTweet: Tweet = {
      id: Date.now().toString(),
      author: currentAccount?.displayName || 'User',
      username: `@${currentAccount?.username || 'user'}`,
      time: 'now',
      content: tweetContent,
      likes: 0,
      retweets: 0,
      replies: 0,
      avatar: currentAccount?.avatar || 'U'
    };
    
    setTweets(prev => [newTweet, ...prev]);
    setTweetContent('');
    setShowComposer(false);
  };

  const handleLike = (tweetId: string) => {
    setTweets(prev => prev.map(tweet => 
      tweet.id === tweetId 
        ? { ...tweet, likes: tweet.likes + 1 }
        : tweet
    ));
  };

  const handleRetweet = (tweetId: string) => {
    setTweets(prev => prev.map(tweet => 
      tweet.id === tweetId 
        ? { ...tweet, retweets: tweet.retweets + 1 }
        : tweet
    ));
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return;
    }
    setShowPasswordChange(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const logout = () => {
    setCurrentView('login');
    setCurrentAccount(null);
    setTweets([]);
    setLoginForm({ username: '', password: '' });
    setRegisterForm({ username: '', email: '', password: '', displayName: '', confirmPassword: '' });
  };

  // Login View
  if (currentView === 'login') {
    return (
      <div className="absolute inset-0 bg-surface-dark flex flex-col">
        <div className="flex flex-col items-center justify-center h-full px-6">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-samsung-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">X</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-white/60">Sign in to your account</p>
            </div>
            
            <div className="space-y-6 w-full max-w-sm mx-auto">
            <input
              type="text"
              placeholder="Phone, email, or username"
              className="w-full bg-transparent border border-gray-500 text-white placeholder-gray-400 text-lg px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-samsung-blue focus:border-transparent"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            />
            
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border border-gray-500 text-white placeholder-gray-400 text-lg px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-samsung-blue focus:border-transparent"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            
            <button
              className="w-full bg-blue-500 text-white text-lg font-bold py-3 rounded-full hover:bg-blue-600/80 transition-colors"
              onClick={handleLogin}
            >
              Sign in
            </button>
          </div>
            <div className="text-center">
              <button
                className="text-blue-500 hover:text-blue-600/80 transition-colors "
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
    <div className="absolute inset-0 bg-surface-dark flex flex-col">
      <div className="flex flex-col items-center justify-center h-full px-6">
        <div className="w-full max-w-sm space-y-8">
          
          {/* Logo + Title */}
          <div className="text-center">
            <div className="w-16 h-16 bg-samsung-blue rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">X</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Join Twitter</h1>
            <p className="text-white/60">Create your account</p>
          </div>
          
          {/* Form */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full bg-transparent border border-gray-500 text-white placeholder-gray-400 text-lg px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-samsung-blue focus:border-transparent"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border border-gray-500 text-white placeholder-gray-400 text-lg px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-samsung-blue focus:border-transparent"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Display Name"
              className="w-full bg-transparent border border-gray-500 text-white placeholder-gray-400 text-lg px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-samsung-blue focus:border-transparent"
              value={registerForm.displayName}
              onChange={(e) => setRegisterForm({ ...registerForm, displayName: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border border-gray-500 text-white placeholder-gray-400 text-lg px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-samsung-blue focus:border-transparent"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-transparent border border-gray-500 text-white placeholder-gray-400 text-lg px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-samsung-blue focus:border-transparent"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
            
            <button
              className="w-full bg-blue-500 text-white text-lg font-bold py-3 rounded-full hover:bg-blue-600/80 transition-colors"
              onClick={handleRegister}
            >
              Create Account
            </button>
          </div>
          
          {/* Switch to login */}
          <div className="text-center">
            <button
              className="text-blue-500 hover:text-blue-600/80 transition-colors text-sm"
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
      <div className="absolute inset-0 bg-surface-dark flex flex-col">
        <div className="bg-surface-dark/50 p-4 border-b border-white/10 mt-2">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
              onClick={() => setCurrentView('main')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-white text-lg font-semibold">Profile</h1>
            <div className="w-10" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Profile Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-samsung-blue rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{currentAccount?.avatar}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-white text-xl font-bold">{currentAccount?.displayName}</h2>
                <p className="text-samsung-blue">@{currentAccount?.username}</p>
                {currentAccount?.verified && (
                  <div className="inline-flex items-center space-x-1 mt-1">
                    <div className="w-4 h-4 bg-samsung-blue rounded-full flex items-center justify-center">
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
                <span className="font-semibold text-white">{currentAccount?.followingCount}</span>
                <span className="ml-1">Following</span>
              </div>
              <div>
                <span className="font-semibold text-white">{currentAccount?.followersCount}</span>
                <span className="ml-1">Followers</span>
              </div>
            </div>
          </div>
          
          {/* Profile Actions */}
          <div className="p-4 space-y-3">
            <Button
              onClick={() => setShowProfileEditor(true)}
              className="w-full hover:text-300 hover:bg-blue-500/60 text-white border border-white/20 rounded-2xl py-3"
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => setShowPasswordChange(true)}
              variant="ghost"
              className="w-full hover:text-300 hover:bg-white/10 text-white border border-white/20 rounded-2xl py-3"
            >
              Change Password
            </Button>
            <Button
              onClick={logout}
              variant="ghost"
              className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl py-3"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Profile Editor Modal */}
        {showProfileEditor && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <div className="bg-surface-dark/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Edit Profile</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
                  onClick={() => setShowProfileEditor(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Display Name"
                  className="w-full bg-surface-dark/50 text-white placeholder-white/60 px-4 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-samsung-blue"
                  value={profileForm.displayName}
                  onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                />
                <textarea
                  placeholder="Bio"
                  rows={3}
                  className="w-full bg-surface-dark/50 text-white placeholder-white/60 px-4 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-samsung-blue resize-none"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Avatar (initials)"
                  className="w-full bg-surface-dark/50 text-white placeholder-white/60 px-4 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-samsung-blue"
                  value={profileForm.avatar}
                  onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="ghost"
                  className="flex-1 text-white/60 hover:text-white bg-white/10 hover:bg-white/20"
                  onClick={() => setShowProfileEditor(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-samsung-blue hover:bg-samsung-blue/80 text-white"
                  onClick={() => setShowProfileEditor(false)}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Password Change Modal */}
        {showPasswordChange && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <div className="bg-surface-dark/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Change Password</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
                  onClick={() => setShowPasswordChange(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full bg-surface-dark/50 text-white placeholder-white/60 px-4 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-samsung-blue"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full bg-surface-dark/50 text-white placeholder-white/60 px-4 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-samsung-blue"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full bg-surface-dark/50 text-white placeholder-white/60 px-4 py-3 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-samsung-blue"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="ghost"
                  className="flex-1 text-white/60 hover:text-white bg-white/10 hover:bg-white/20"
                  onClick={() => setShowPasswordChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-samsung-blue hover:bg-samsung-blue/80 text-white"
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Twitter View
  return (
    <div className="absolute inset-0 bg-surface-dark flex flex-col">
      {/* App Header */}
      <div className="bg-surface-dark/50 p-4 border-b border-white/10 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-black/20 text-white/60 hover:text-white/80 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-samsung-blue rounded-full text-white text-sm flex items-center justify-center font-bold">X</div>
              <h1 className="text-xl font-semibold text-white">Twitter</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
              onClick={() => setCurrentView('profile')}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tweet Composer Modal */}
      {showComposer && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-surface-dark/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">New Tweet</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
                onClick={() => setShowComposer(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <textarea 
                className="w-full bg-surface-dark/50 placeholder-gray-400 text-black placeholder-white/60 resize-none border border-white/20 outline-none p-4 rounded-2xl focus:border-samsung-blue"
                placeholder="What's happening?"
                rows={4}
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
              />
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 text-samsung-blue">
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-white/10 rounded-full">
                    <Image className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-white/10 rounded-full">
                    <FileText className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-white/10 rounded-full">
                    <BarChart3 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-white/10 rounded-full">
                    <MapPin className="w-5 h-5" />
                  </Button>
                </div>
                <Button 
                  className="bg-samsung-blue hover:bg-samsung-blue/80 text-white px-4 py-2 rounded-full font-medium disabled:opacity-50"
                  disabled={!tweetContent.trim()}
                  onClick={handlePostTweet}
                >
                  Tweet
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {currentTab === 'home' && (
          <div>
            {tweets.map((tweet) => (
              <div 
                key={tweet.id}
                className="p-4 border-b border-white/10 hover:bg-surface-dark/30 transition-colors"
              >
                <div className="flex space-x-2">
                  <div className="w-10 h-10 bg-samsung-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{tweet.avatar}</span>
                  </div>
                  <div className="flex-1 ">
                    <div className="flex items-center space-x-1 mb-2 ml-2">
                      <span className="text-white font-semibold">{tweet.author}</span>
                      <span className="text-samsung-blue text-xs">@{tweet.username}</span>
                      {tweet.verified && (
                        <div className="w-2 h-2 bg-samsung-blue rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      <span className="text-white/50 text-xs">·</span>
                      <span className="text-white/50 text-xs">{tweet.time}</span>
                    </div>
                    <p className="text-white mb-2 leading-relaxed text-sm font-large ml-2">{tweet.content}</p>
                    {tweet.imageUrl && (
                      <div className="rounded-2xl overflow-hidden mb-2">
                        <img 
                          src={tweet.imageUrl} 
                          alt="Tweet image" 
                          className="w-full h-40 object-cover" 
                        />
                      </div>
                    )}
                    {tweet.location && (
                      <div className="flex items-center space-x-1 text-samsung-blue mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{tweet.location}</span>
                      </div>
                    )}
                    <div className="flex justify-between max-w-md text-white/60">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2 hover:text-red-400 transition-colors p-2"
                        onClick={() => handleLike(tweet.id)}
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{tweet.likes}</span>
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2 hover:text-green-400 transition-colors p-2"
                        onClick={() => handleRetweet(tweet.id)}
                      >
                        <Repeat className="w-4 h-4" />
                        <span className="text-sm">{tweet.retweets}</span>
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2 hover:text-samsung-blue transition-colors p-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">{tweet.replies}</span>
                      </Button>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="hover:text-samsung-blue transition-colors p-2"
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'search' && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="text-center py-8">
                <Hash className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Search Twitter</h3>
                <p className="text-white/60">Find people, topics, and conversations</p>
              </div>
              <div className="space-y-3">
                {['#React', '#WebDev', '#MobileApps', '#UI/UX', '#Programming'].map((topic, index) => (
                  <div key={index} className="bg-surface-dark/30 rounded-2xl p-4 cursor-pointer hover:bg-surface-dark/50 transition-colors">
                    <h4 className="text-white font-medium">{topic}</h4>
                    <p className="text-white/60 text-sm">Trending topic</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'notifications' && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="text-center py-8">
                <Bell className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Notifications</h3>
                <p className="text-white/60">Stay updated with what's happening</p>
              </div>
              <div className="space-y-3">
                {['New follower', 'Tweet liked', 'Retweet', 'Mention'].map((notification, index) => (
                  <div key={index} className="bg-surface-dark/30 rounded-2xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-samsung-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">U</span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{notification}</p>
                        <p className="text-white/60 text-xs">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'messages' && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="text-center py-8">
                <Mail className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Messages</h3>
                <p className="text-white/60">Your private conversations</p>
              </div>
              <div className="space-y-3">
                {['John Doe', 'Jane Smith', 'Tech Support', 'News Updates'].map((contact, index) => (
                  <div key={index} className="bg-surface-dark/30 rounded-2xl p-4 cursor-pointer hover:bg-surface-dark/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-samsung-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{contact.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{contact}</p>
                        <p className="text-white/60 text-sm">Last message...</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating New Tweet Button */}
      <Button
        onClick={() => setShowComposer(true)}
        className="absolute bottom-20 right-4 w-14 h-14 bg-samsung-blue hover:bg-samsung-blue/80 text-white rounded-full shadow-lg z-40 transition-all duration-200 hover:scale-110"
      >
        <Edit3 className="w-6 h-6" />
      </Button>

      {/* Bottom Navigation Bar */}
      <div className="border-t border-white/10">
        <div className="flex items-center justify-around py-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 ${
              currentTab === 'home' 
                ? 'text-samsung-blue bg-samsung-blue/20' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setCurrentTab('home')}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 ${
              currentTab === 'search' 
                ? 'text-samsung-blue bg-samsung-blue/20' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setCurrentTab('search')}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 ${
              currentTab === 'notifications' 
                ? 'text-samsung-blue bg-samsung-blue/20' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setCurrentTab('notifications')}
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs">Notifications</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-all duration-200 ${
              currentTab === 'messages' 
                ? 'text-samsung-blue bg-samsung-blue/20' 
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setCurrentTab('messages')}
          >
            <Mail className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
