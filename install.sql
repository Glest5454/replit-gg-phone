-- Samsung Galaxy S25 Phone Script - Database Installation

-- Phone Users Table
CREATE TABLE IF NOT EXISTS `phone_users` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `citizen_id` varchar(50) NOT NULL UNIQUE,
  `phone_number` varchar(20) NOT NULL UNIQUE,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `settings` json DEFAULT '{}',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `citizen_id` (`citizen_id`),
  KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Phone Contacts Table
CREATE TABLE IF NOT EXISTS `phone_contacts` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `owner_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `avatar` text,
  `favorite` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `owner_id` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Phone Messages Table
CREATE TABLE IF NOT EXISTS `phone_messages` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `sender_id` varchar(50) NOT NULL,
  `receiver_id` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `read` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Phone Transactions Table
CREATE TABLE IF NOT EXISTS `phone_transactions` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `user_id` varchar(50) NOT NULL,
  `type` enum('deposit','withdraw','transfer') NOT NULL,
  `amount` int(11) NOT NULL,
  `description` text NOT NULL,
  `target_account` varchar(50) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Phone Notes Table
CREATE TABLE IF NOT EXISTS `phone_notes` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `user_id` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `color` varchar(7) DEFAULT '#fbbf24',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Phone Photos Table
CREATE TABLE IF NOT EXISTS `phone_photos` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `user_id` varchar(50) NOT NULL,
  `url` text NOT NULL,
  `thumbnail` text,
  `filename` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Twitter Accounts Table
CREATE TABLE IF NOT EXISTS `twitter_accounts` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `user_id` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL UNIQUE,
  `display_name` varchar(100) NOT NULL,
  `bio` text,
  `avatar` text,
  `verified` tinyint(1) DEFAULT 0,
  `followers` int(11) DEFAULT 0,
  `following` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Twitter Tweets Table
CREATE TABLE IF NOT EXISTS `twitter_tweets` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `author_id` varchar(36) NOT NULL,
  `content` text NOT NULL,
  `image_url` text,
  `likes` int(11) DEFAULT 0,
  `retweets` int(11) DEFAULT 0,
  `replies` int(11) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  FOREIGN KEY (`author_id`) REFERENCES `twitter_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Mail Accounts Table
CREATE TABLE IF NOT EXISTS `mail_accounts` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `user_id` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Phone Mails Table
CREATE TABLE IF NOT EXISTS `phone_mails` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `sender_id` varchar(36) NOT NULL,
  `receiver_email` varchar(255) NOT NULL,
  `subject` varchar(300) NOT NULL,
  `content` text NOT NULL,
  `read` tinyint(1) DEFAULT 0,
  `starred` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_email` (`receiver_email`),
  FOREIGN KEY (`sender_id`) REFERENCES `mail_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Yellow Pages Table
CREATE TABLE IF NOT EXISTS `phone_yellow_pages` (
  `id` varchar(36) NOT NULL DEFAULT (UUID()),
  `business_name` varchar(200) NOT NULL,
  `category` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `address` text,
  `description` text,
  `website` varchar(255),
  `rating` int(1) DEFAULT 5,
  `verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  KEY `business_name` (`business_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;