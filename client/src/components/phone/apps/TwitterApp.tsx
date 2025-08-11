import { ArrowLeft, Edit3, Image, FileText, BarChart3, MapPin, MessageCircle, Repeat, Heart, Share } from 'lucide-react';
import { useState } from 'react';

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
  likes: number;
  retweets: number;
  replies: number;
  verified?: boolean;
  avatar: string;
}

const mockTweets: Tweet[] = [
  {
    id: '1',
    author: 'Mike Johnson',
    username: '@mikej',
    time: '2h',
    content: 'Just finished an amazing race around the city! 🏎️ The new update looks incredible. Thanks to the dev team! #LosSantos #Racing',
    likes: 89,
    retweets: 24,
    replies: 12,
    avatar: 'MJ'
  },
  {
    id: '2',
    author: 'Sarah Kim',
    username: '@sarahk_official',
    time: '4h',
    content: 'New business opening in Downtown tomorrow! 🎉 Come check out our grand opening event. Free coffee for the first 50 customers! ☕',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300',
    likes: 342,
    retweets: 127,
    replies: 45,
    verified: true,
    avatar: 'SK'
  }
];

export const TwitterApp = ({ onBack }: TwitterAppProps) => {
  const [tweetContent, setTweetContent] = useState('');

  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="twitter-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">T</div>
          <h1 className="text-white text-lg font-semibold">Warble</h1>
        </div>
        <button 
          className="oneui-button p-2"
          data-testid="new-tweet"
        >
          <Edit3 className="w-5 h-5 text-white" />
        </button>
      </div>
      
      {/* Tweet Composer */}
      <div className="p-4 border-b border-white/10">
        <div className="flex space-x-3">
          <div className="w-10 h-10 bg-samsung-blue rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">JD</span>
          </div>
          <div className="flex-1">
            <textarea 
              className="w-full bg-transparent text-white placeholder-white/50 resize-none border-none outline-none" 
              placeholder="What's happening?"
              rows={3}
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
              data-testid="tweet-composer"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-4 text-samsung-blue">
                <button className="oneui-button" data-testid="add-image">
                  <Image className="w-5 h-5" />
                </button>
                <button className="oneui-button" data-testid="add-gif">
                  <FileText className="w-5 h-5" />
                </button>
                <button className="oneui-button" data-testid="add-poll">
                  <BarChart3 className="w-5 h-5" />
                </button>
                <button className="oneui-button" data-testid="add-location">
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
              <button 
                className="oneui-button bg-samsung-blue text-white px-6 py-2 rounded-full font-medium disabled:opacity-50"
                disabled={!tweetContent.trim()}
                data-testid="publish-tweet"
              >
                Warble
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tweet Feed */}
      <div className="flex-1 overflow-y-auto">
        {mockTweets.map((tweet) => (
          <div 
            key={tweet.id}
            className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
            data-testid={`tweet-${tweet.id}`}
          >
            <div className="flex space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tweet.id === '1' ? 'bg-purple-500' : 'bg-pink-500'
              }`}>
                <span className="text-white font-semibold text-sm">{tweet.avatar}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-white font-medium">{tweet.author}</span>
                  <span className="text-blue-400">{tweet.username}</span>
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
                  <div className="rounded-samsung-sm overflow-hidden mb-3">
                    <img 
                      src={tweet.imageUrl} 
                      alt="Tweet image" 
                      className="w-full h-32 object-cover" 
                    />
                  </div>
                )}
                <div className="flex justify-between max-w-md text-white/60">
                  <button 
                    className="oneui-button flex items-center space-x-2 hover:text-blue-400 transition-colors"
                    data-testid={`reply-${tweet.id}`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{tweet.replies}</span>
                  </button>
                  <button 
                    className="oneui-button flex items-center space-x-2 hover:text-green-400 transition-colors"
                    data-testid={`retweet-${tweet.id}`}
                  >
                    <Repeat className="w-4 h-4" />
                    <span className="text-sm">{tweet.retweets}</span>
                  </button>
                  <button 
                    className="oneui-button flex items-center space-x-2 hover:text-red-400 transition-colors"
                    data-testid={`like-${tweet.id}`}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{tweet.likes}</span>
                  </button>
                  <button 
                    className="oneui-button hover:text-blue-400 transition-colors"
                    data-testid={`share-${tweet.id}`}
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
