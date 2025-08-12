CREATE TABLE IF NOT EXISTS twitter_tweets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    location VARCHAR(100),
    likes_count INTEGER DEFAULT 0,
    retweets_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (author_id) REFERENCES twitter_accounts(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_author_id ON twitter_tweets(author_id);
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_created_at ON twitter_tweets(created_at);
CREATE INDEX IF NOT EXISTS idx_twitter_tweets_likes_count ON twitter_tweets(likes_count);

-- Likes table for many-to-many relationship
CREATE TABLE IF NOT EXISTS twitter_tweet_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tweet_id) REFERENCES twitter_tweets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES twitter_accounts(id) ON DELETE CASCADE,
    UNIQUE(tweet_id, user_id)
);

-- Retweets table for many-to-many relationship
CREATE TABLE IF NOT EXISTS twitter_tweet_retweets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tweet_id) REFERENCES twitter_tweets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES twitter_accounts(id) ON DELETE CASCADE,
    UNIQUE(tweet_id, user_id)
);

-- Replies table for tweet replies
CREATE TABLE IF NOT EXISTS twitter_tweet_replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tweet_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tweet_id) REFERENCES twitter_tweets(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES twitter_accounts(id) ON DELETE CASCADE
);
