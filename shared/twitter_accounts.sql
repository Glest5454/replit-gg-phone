CREATE TABLE IF NOT EXISTS twitter_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar VARCHAR(10) DEFAULT 'U',
    bio TEXT,
    verified BOOLEAN DEFAULT FALSE,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    user_id VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_twitter_accounts_username ON twitter_accounts(username);
CREATE INDEX IF NOT EXISTS idx_twitter_accounts_email ON twitter_accounts(email);
CREATE INDEX IF NOT EXISTS idx_twitter_accounts_created_at ON twitter_accounts(created_at);
