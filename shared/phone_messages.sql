-- Phone Messages Database Schema
-- This table stores all text messages between phone contacts

CREATE TABLE IF NOT EXISTS phone_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id VARCHAR(100) NOT NULL, -- Citizen ID of sender
    receiver_id VARCHAR(100) NOT NULL, -- Citizen ID of receiver
    message TEXT NOT NULL, -- Message content
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, location, etc.
    metadata TEXT -- JSON string for additional data (image URL, location coordinates, etc.)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_phone_messages_sender_id ON phone_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_phone_messages_receiver_id ON phone_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_phone_messages_timestamp ON phone_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_phone_messages_conversation ON phone_messages(sender_id, receiver_id, timestamp);

-- Phone Contacts Table (if not exists)
CREATE TABLE IF NOT EXISTS phone_contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id VARCHAR(100) NOT NULL, -- Citizen ID of contact owner
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    avatar VARCHAR(255), -- URL to avatar image
    favorite BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_contact DATETIME, -- Last time contacted
    notes TEXT -- Additional notes about contact
);

-- Indexes for contacts
CREATE INDEX IF NOT EXISTS idx_phone_contacts_owner_id ON phone_contacts(owner_id);
CREATE INDEX IF NOT EXISTS idx_phone_contacts_phone_number ON phone_contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_phone_contacts_favorite ON phone_contacts(favorite);

-- Phone Call History Table
CREATE TABLE IF NOT EXISTS phone_call_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    caller_id VARCHAR(100) NOT NULL, -- Citizen ID of caller
    receiver_id VARCHAR(100) NOT NULL, -- Citizen ID of receiver
    call_type VARCHAR(20) DEFAULT 'voice', -- voice, video
    status VARCHAR(20) DEFAULT 'completed', -- completed, missed, declined, ongoing
    duration INTEGER DEFAULT 0, -- Call duration in seconds
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT -- Additional call notes
);

-- Indexes for call history
CREATE INDEX IF NOT EXISTS idx_phone_call_history_caller_id ON phone_call_history(caller_id);
CREATE INDEX IF NOT EXISTS idx_phone_call_history_receiver_id ON phone_call_history(receiver_id);
CREATE INDEX IF NOT EXISTS idx_phone_call_history_timestamp ON phone_call_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_phone_call_history_status ON phone_call_history(status);

-- Sample data for testing (optional)
-- INSERT INTO phone_contacts (owner_id, name, phone_number, favorite) VALUES 
-- ('CITIZEN001', 'John Doe', '555-0123', TRUE),
-- ('CITIZEN001', 'Jane Smith', '555-0456', FALSE),
-- ('CITIZEN001', 'Mike Johnson', '555-0789', TRUE);

-- INSERT INTO phone_messages (sender_id, receiver_id, message) VALUES
-- ('CITIZEN001', 'CITIZEN002', 'Hey, how are you?'),
-- ('CITIZEN002', 'CITIZEN001', 'I''m good, thanks! How about you?'),
-- ('CITIZEN001', 'CITIZEN003', 'See you tomorrow!');
