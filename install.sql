
-- Core Phone Tables

-- Phone Contacts Table
CREATE TABLE IF NOT EXISTS `phone_contacts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `owner_id` varchar(50) NOT NULL,
    `name` varchar(100) NOT NULL,
    `phone_number` varchar(20) NOT NULL,
    `avatar` varchar(255) DEFAULT '',
    `favorite` tinyint(1) DEFAULT 0,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `owner_id` (`owner_id`),
    KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Messages Table
CREATE TABLE IF NOT EXISTS `phone_messages` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `sender_id` varchar(50) NOT NULL,
    `receiver_id` varchar(50) NOT NULL,
    `message` text NOT NULL,
    `message_type` varchar(20) DEFAULT 'text',
    `metadata` json DEFAULT NULL,
    `timestamp` timestamp DEFAULT CURRENT_TIMESTAMP,
    `is_read` tinyint(1) DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `sender_id` (`sender_id`),
    KEY `receiver_id` (`receiver_id`),
    KEY `timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Notes Table
CREATE TABLE IF NOT EXISTS `phone_notes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `title` varchar(255) NOT NULL,
    `content` text NOT NULL,
    `color` varchar(7) DEFAULT '#fbbf24',
    `category_id` int(11) DEFAULT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Note Categories Table
CREATE TABLE IF NOT EXISTS `phone_note_categories` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `name` varchar(100) NOT NULL,
    `color` varchar(7) DEFAULT '#fbbf24',
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Transactions Table
CREATE TABLE IF NOT EXISTS `phone_transactions` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `type` varchar(20) NOT NULL,
    `amount` decimal(10,2) NOT NULL,
    `description` varchar(255) DEFAULT NULL,
    `target_account` varchar(50) DEFAULT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `type` (`type`),
    KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Photos Table
CREATE TABLE IF NOT EXISTS `phone_photos` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `image_url` varchar(500) NOT NULL,
    `filter` varchar(50) DEFAULT '',
    `effects` varchar(100) DEFAULT '',
    `css_filter` varchar(100) DEFAULT '',
    `metadata` json DEFAULT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Favorite Locations Table for Maps App
CREATE TABLE IF NOT EXISTS `phone_favorite_locations` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `name` varchar(100) NOT NULL,
    `address` varchar(255) DEFAULT NULL,
    `coordinates` json NOT NULL,
    `category` varchar(50) DEFAULT 'personal',
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `category` (`category`),
    KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default data for new tables
INSERT IGNORE INTO `phone_favorite_locations` (`user_id`, `name`, `address`, `coordinates`, `category`) VALUES
('default', 'Home', '123 Grove Street, Los Santos', '{"x": 34.0422, "y": -118.2337, "z": 0}', 'home'),
('default', 'Work', 'Maze Bank Building, Los Santos', '{"x": 34.0562, "y": -118.2477, "z": 0}', 'work');

-- Enhanced App Tables

-- Phone Calculator History Table
CREATE TABLE IF NOT EXISTS `phone_calculations` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `expression` varchar(255) NOT NULL,
    `result` varchar(255) NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Alarms Table
CREATE TABLE IF NOT EXISTS `phone_alarms` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `time` time NOT NULL,
    `days` json DEFAULT NULL,
    `label` varchar(100) DEFAULT 'Alarm',
    `sound` varchar(100) DEFAULT 'default',
    `enabled` tinyint(1) DEFAULT 1,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Playlists Table
CREATE TABLE IF NOT EXISTS `phone_playlists` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `name` varchar(100) NOT NULL,
    `songs` json DEFAULT NULL,
    `is_public` tinyint(1) DEFAULT 0,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `is_public` (`is_public`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Businesses Table (Yellow Pages)
CREATE TABLE IF NOT EXISTS `phone_businesses` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `owner_id` varchar(50) NOT NULL,
    `name` varchar(100) NOT NULL,
    `category` varchar(50) NOT NULL,
    `description` text DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `address` varchar(255) DEFAULT NULL,
    `status` enum('pending','approved','rejected') DEFAULT 'pending',
    `rating` decimal(3,2) DEFAULT 0.00,
    `review_count` int(11) DEFAULT 0,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `owner_id` (`owner_id`),
    KEY `category` (`category`),
    KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Settings Table
CREATE TABLE IF NOT EXISTS `phone_settings` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `settings` json NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Social Media Tables

-- Twitter Accounts Table
CREATE TABLE IF NOT EXISTS `twitter_accounts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `username` varchar(50) NOT NULL UNIQUE,
    `email` varchar(100) NOT NULL UNIQUE,
    `password_hash` varchar(255) NOT NULL,
    `display_name` varchar(100) NOT NULL,
    `avatar` varchar(255) DEFAULT NULL,
    `bio` text DEFAULT NULL,
    `verified` tinyint(1) DEFAULT 0,
    `followers_count` int(11) DEFAULT 0,
    `following_count` int(11) DEFAULT 0,
    `last_login` timestamp NULL DEFAULT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Twitter Tweets Table
CREATE TABLE IF NOT EXISTS `twitter_tweets` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `author_id` int(11) NOT NULL,
    `content` text NOT NULL,
    `image_url` varchar(500) DEFAULT NULL,
    `location` varchar(100) DEFAULT NULL,
    `likes_count` int(11) DEFAULT 0,
    `retweets_count` int(11) DEFAULT 0,
    `replies_count` int(11) DEFAULT 0,
    `is_deleted` tinyint(1) DEFAULT 0,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `author_id` (`author_id`),
    KEY `created_at` (`created_at`),
    KEY `is_deleted` (`is_deleted`),
    FOREIGN KEY (`author_id`) REFERENCES `twitter_accounts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Twitter Tweet Likes Table
CREATE TABLE IF NOT EXISTS `twitter_tweet_likes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `tweet_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `tweet_user` (`tweet_id`, `user_id`),
    KEY `tweet_id` (`tweet_id`),
    KEY `user_id` (`user_id`),
    FOREIGN KEY (`tweet_id`) REFERENCES `twitter_tweets`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `twitter_accounts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Twitter Tweet Retweets Table
CREATE TABLE IF NOT EXISTS `twitter_tweet_retweets` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `tweet_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `tweet_user` (`tweet_id`, `user_id`),
    KEY `tweet_id` (`tweet_id`),
    KEY `user_id` (`user_id`),
    FOREIGN KEY (`tweet_id`) REFERENCES `twitter_tweets`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `twitter_accounts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mail Tables

-- Mail Accounts Table
CREATE TABLE IF NOT EXISTS `mail_accounts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `email` varchar(100) NOT NULL UNIQUE,
    `password` varchar(255) NOT NULL,
    `display_name` varchar(100) NOT NULL,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Mails Table
CREATE TABLE IF NOT EXISTS `phone_mails` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `sender_id` int(11) NOT NULL,
    `receiver_email` varchar(100) NOT NULL,
    `subject` varchar(255) NOT NULL,
    `content` text NOT NULL,
    `read` tinyint(1) DEFAULT 0,
    `starred` tinyint(1) DEFAULT 0,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `sender_id` (`sender_id`),
    KEY `receiver_email` (`receiver_email`),
    KEY `created_at` (`created_at`),
    FOREIGN KEY (`sender_id`) REFERENCES `mail_accounts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone System Tables

-- Phone Notifications Table
CREATE TABLE IF NOT EXISTS `phone_notifications` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `title` varchar(255) NOT NULL,
    `message` text NOT NULL,
    `type` varchar(50) DEFAULT 'info',
    `app` varchar(50) DEFAULT NULL,
    `read` tinyint(1) DEFAULT 0,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `type` (`type`),
    KEY `created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone Call Logs Table
CREATE TABLE IF NOT EXISTS `phone_call_logs` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `caller_id` varchar(50) NOT NULL,
    `receiver_id` varchar(50) NOT NULL,
    `call_type` enum('incoming','outgoing','missed') NOT NULL,
    `duration` int(11) DEFAULT 0,
    `start_time` timestamp DEFAULT CURRENT_TIMESTAMP,
    `end_time` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `caller_id` (`caller_id`),
    KEY `receiver_id` (`receiver_id`),
    KEY `start_time` (`start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Phone App Usage Table
CREATE TABLE IF NOT EXISTS `phone_app_usage` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` varchar(50) NOT NULL,
    `app_name` varchar(50) NOT NULL,
    `open_count` int(11) DEFAULT 0,
    `total_time` int(11) DEFAULT 0,
    `last_used` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_app` (`user_id`, `app_name`),
    KEY `user_id` (`user_id`),
    KEY `app_name` (`app_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default data

-- Insert default note categories
INSERT IGNORE INTO `phone_note_categories` (`id`, `user_id`, `name`, `color`) VALUES
(1, 'system', 'Personal', '#3b82f6'),
(2, 'system', 'Work', '#10b981'),
(3, 'system', 'Important', '#ef4444'),
(4, 'system', 'Ideas', '#f59e0b'),
(5, 'system', 'Shopping', '#8b5cf6');

-- Insert default phone settings template
INSERT IGNORE INTO `phone_settings` (`id`, `user_id`, `settings`) VALUES
(1, 'default', '{"theme":"dark","ringtone":"default","vibration":true,"volume":80,"brightness":70,"autoLock":300,"notifications":true}');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_phone_contacts_owner_phone` ON `phone_contacts` (`owner_id`, `phone_number`);
CREATE INDEX IF NOT EXISTS `idx_phone_messages_sender_receiver` ON `phone_messages` (`sender_id`, `receiver_id`);
CREATE INDEX IF NOT EXISTS `idx_phone_notes_user_category` ON `phone_notes` (`user_id`, `category_id`);
CREATE INDEX IF NOT EXISTS `idx_phone_photos_user_created` ON `phone_photos` (`user_id`, `created_at`);
CREATE INDEX IF NOT EXISTS `idx_twitter_tweets_author_created` ON `twitter_tweets` (`author_id`, `created_at`);
CREATE INDEX IF NOT EXISTS `idx_phone_businesses_category_status` ON `phone_businesses` (`category`, `status`);

-- Add foreign key constraints
ALTER TABLE `phone_notes` 
ADD CONSTRAINT `fk_notes_category` 
FOREIGN KEY (`category_id`) REFERENCES `phone_note_categories`(`id`) ON DELETE SET NULL;

-- Create views for common queries

-- View for recent conversations
CREATE OR REPLACE VIEW `phone_recent_conversations` AS
SELECT 
    c.id,
    c.name,
    c.phone_number,
    c.avatar,
    c.favorite,
    pm.message as last_message,
    pm.message_type as last_message_type,
    pm.timestamp as last_message_time,
    COUNT(CASE WHEN pm2.is_read = 0 AND pm2.receiver_id = c.owner_id THEN 1 END) as unread_count
FROM phone_contacts c
LEFT JOIN phone_messages pm ON (
    (pm.sender_id = c.owner_id OR pm.receiver_id = c.owner_id) AND
    pm.timestamp = (
        SELECT MAX(timestamp) 
        FROM phone_messages 
        WHERE (sender_id = c.owner_id OR receiver_id = c.owner_id)
    )
)
LEFT JOIN phone_messages pm2 ON (
    pm2.receiver_id = c.owner_id AND pm2.is_read = 0
)
GROUP BY c.id, c.name, c.phone_number, c.avatar, c.favorite;

-- View for phone statistics
CREATE OR REPLACE VIEW `phone_user_stats` AS
SELECT 
    user_id,
    COUNT(DISTINCT c.id) as total_contacts,
    COUNT(DISTINCT n.id) as total_notes,
    COUNT(DISTINCT p.id) as total_photos,
    COUNT(DISTINCT m.id) as total_messages,
    MAX(COALESCE(c.updated_at, c.created_at)) as last_contact_update,
    MAX(COALESCE(n.updated_at, n.created_at)) as last_note_update,
    MAX(p.created_at) as last_photo_upload,
    MAX(m.timestamp) as last_message_sent
FROM (
    SELECT DISTINCT user_id FROM phone_contacts
    UNION
    SELECT DISTINCT user_id FROM phone_notes
    UNION
    SELECT DISTINCT user_id FROM phone_photos
    UNION
    SELECT DISTINCT sender_id as user_id FROM phone_messages
) users
LEFT JOIN phone_contacts c ON users.user_id = c.owner_id
LEFT JOIN phone_notes n ON users.user_id = n.user_id
LEFT JOIN phone_photos p ON users.user_id = p.user_id
LEFT JOIN phone_messages m ON users.user_id = m.sender_id
GROUP BY user_id;

-- Grant permissions (adjust according to your database setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON phone_* TO 'your_username'@'localhost';
-- FLUSH PRIVILEGES;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS `idx_favorite_locations_user_category` ON `phone_favorite_locations` (`user_id`, `category`);
CREATE INDEX IF NOT EXISTS `idx_favorite_locations_created` ON `phone_favorite_locations` (`created_at`);
