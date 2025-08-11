# Samsung Galaxy S25 Phone Script - Installation Guide

## Prerequisites

Before installing the phone script, ensure you have the following dependencies:

### Required Dependencies
- **FiveM Server** (Latest recommended)
- **oxmysql** - Database connector
- **QBCore** OR **ESX** - Framework
- **Node.js** (for React development, optional)

### Optional Dependencies
- **pma-voice** - For voice call functionality
- **screenshot-basic** - For camera functionality
- **qb-banking** / **esx_society** - Enhanced banking integration

## Installation Steps

### 1. Download and Extract
1. Download the latest release from GitHub
2. Extract the folder to your server's `resources` directory
3. Rename the folder to `phone` (or your preferred name)

### 2. Database Setup
The script will automatically create the required database tables on first startup. However, you can manually create them if needed:

```sql
-- Run these queries in your database (optional - auto-created on startup)
CREATE TABLE IF NOT EXISTS `phone_users` (
    `id` varchar(50) NOT NULL,
    `citizen_id` varchar(50) NOT NULL,
    `phone_number` varchar(20) NOT NULL,
    `first_name` varchar(50) NOT NULL,
    `last_name` varchar(50) NOT NULL,
    `settings` longtext DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `citizen_id` (`citizen_id`),
    UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `phone_contacts` (
    `id` varchar(50) NOT NULL,
    `owner_id` varchar(50) NOT NULL,
    `name` varchar(100) NOT NULL,
    `phone_number` varchar(20) NOT NULL,
    `avatar` text DEFAULT NULL,
    `favorite` tinyint(1) DEFAULT 0,
    `created_at` timestamp NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Additional tables are created automatically
