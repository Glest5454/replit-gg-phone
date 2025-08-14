Config = {}

-- Framework Configuration
Config.Framework = "qb-core" -- "qb-core" or "esx"

-- Phone Settings
Config.PhoneSettings = {
    openKey = 'F1', -- Key to open/close phone
    enableNotifications = true,
    maxPhotos = 50,
    maxNotes = 100,
    maxContacts = 500,
    phoneModel = "samsung_s25" -- Phone model for animations
}

-- Database Configuration
Config.Database = {
    oxmysql = true, -- Set to false if using a different database system
    tablePrefix = "phone_" -- Prefix for database tables
}

-- Apps Configuration
Config.EnabledApps = {
    lockscreen = true,
    homescreen = true,
    contacts = true,
    messages = true,
    phone = true,
    camera = true,
    gallery = true,
    notes = true,
    calculator = true,
    settings = true,
    banking = true,
    twitter = true, -- Warble
    spotify = true,
    clock = true,
    yellowpages = true,
    maps = true,
    garage = true
}

-- App Permissions
Config.AppPermissions = {
    banking = "phone.banking",
    twitter = "phone.twitter",
    yellowpages = "phone.yellowpages.view"
}

-- Banking Configuration
Config.Banking = {
    enableTransfers = true,
    enableDeposits = true,
    enableWithdrawals = true,
    maxTransferAmount = 50000,
    transactionFee = 0.01 -- 1% fee
}

-- Twitter/Warble Configuration
Config.Twitter = {
    maxTweetLength = 280,
    enableImages = true,
    enableHashtags = true,
    enableMentions = true,
    cooldownTime = 30 -- seconds between tweets
}

-- Camera Configuration
Config.Camera = {
    saveLocation = "screenshots/", -- Folder to save screenshots
    uploadToImgur = false, -- Enable Imgur upload
    imgurClientId = "", -- Imgur Client ID
    maxPhotoSize = 5 -- MB
}

-- Voice Integration (pma-voice)
Config.Voice = {
    enabled = true,
    callCommand = "call",
    hangupCommand = "hangup",
    voiceRange = 20.0, -- Voice call range
    enableProximity = true -- Enable proximity-based voice
}

-- Yellow Pages Configuration
Config.YellowPages = {
    enableBusinessRegistration = true,
    registrationFee = 100,
    maxBusinessesPerPlayer = 3,
    moderationRequired = true
}

-- Notification Settings
Config.Notifications = {
    position = "top-right", -- top-left, top-right, bottom-left, bottom-right
    timeout = 5000, -- milliseconds
    maxVisible = 5
}

-- Security Settings
Config.Security = {
    enablePinLock = true,
    defaultPin = "1234",
    maxPinAttempts = 3,
    lockoutTime = 300 -- seconds
}

-- Performance Settings
Config.Performance = {
    updateInterval = 1000, -- milliseconds
    maxRenderDistance = 10.0, -- meters
    enableLOD = true
}

-- Localization
Config.Locale = "en" -- Language file to use

-- Debug Settings
Config.Debug = {
    enabled = false,
    verboseLogging = false
}

-- Integration Settings
Config.Integrations = {
    qb_banking = true, -- QBCore banking integration
    esx_society = true, -- ESX society integration
    screenshot_basic = true, -- Screenshot basic integration
    ox_inventory = true, -- Ox inventory integration
    pma_voice = true -- pma-voice integration
}

-- Phone Item Configuration
Config.PhoneItem = {
    name = "phone", -- Item name in inventory
    useable = true, -- Require phone item to use phone
    shouldClose = false,
    combinable = nil,
    description = "A modern smartphone with advanced features"
}

-- Default Phone Settings for New Users
Config.DefaultSettings = {
    theme = "dark",
    ringtone = "default",
    vibration = true,
    volume = 80,
    brightness = 70,
    autoLock = 300, -- seconds
    notifications = true
}

-- CFX Export Configuration
Config.Exports = {
    enableExports = true, -- Enable CFX exports for other resources
    exportNames = {
        isPhoneOpen = "IsPhoneOpen",
        getPhoneData = "GetPhoneData",
        openPhone = "OpenPhone",
        closePhone = "ClosePhone",
        getPhoneNumber = "GetPhoneNumber",
        getPlayerName = "GetPlayerName"
    }
}

-- Screenshot-basic Configuration
Config.ScreenshotBasic = {
    enabled = true,
    uploadUrl = "", -- Set your screenshot-basic upload URL
    maxFileSize = 5, -- MB
    allowedFormats = {"jpg", "jpeg", "png", "gif"},
    compression = {
        enabled = true,
        quality = 80 -- JPEG quality (1-100)
    }
}

-- pma-voice Configuration
Config.PmaVoice = {
    enabled = true,
    callChannels = {
        prefix = "phone-",
        maxParticipants = 2,
        voiceRange = 20.0
    },
    proximity = {
        enabled = true,
        range = 20.0,
        fadeDistance = 5.0
    }
}

-- Database Tables Configuration
Config.DatabaseTables = {
    -- Core tables
    phone_contacts = true,
    phone_messages = true,
    phone_notes = true,
    phone_transactions = true,
    phone_photos = true,
    
    -- Enhanced app tables
    phone_note_categories = true,
    phone_calculations = true,
    phone_alarms = true,
    phone_playlists = true,
    phone_businesses = true,
    phone_settings = true,
    
    -- Social media tables
    twitter_accounts = true,
    twitter_tweets = true,
    twitter_tweet_likes = true,
    twitter_tweet_retweets = true,
    
    -- Mail tables
    mail_accounts = true,
    phone_mails = true
}

-- Phone Features Configuration
Config.Features = {
    -- Basic features
    contacts = true,
    messages = true,
    calls = true,
    notes = true,
    calculator = true,
    clock = true,
    camera = true,
    gallery = true,
    
    -- Advanced features
    banking = true,
    twitter = true,
    spotify = true,
    yellowpages = true,
    mail = true,
    
    -- System features
    settings = true,
    lockscreen = true,
    notifications = true,
    taskManager = true
}

-- Phone UI Configuration
Config.UI = {
    theme = {
        primary = "#3b82f6",
        secondary = "#64748b",
        success = "#10b981",
        warning = "#f59e0b",
        error = "#ef4444",
        background = "#0f172a",
        surface = "#1e293b",
        text = "#f8fafc"
    },
    animations = {
        enabled = true,
        duration = 300, -- milliseconds
        easing = "ease-out"
    },
    responsive = {
        enabled = true,
        breakpoints = {
            mobile = 768,
            tablet = 1024,
            desktop = 1200
        }
    }
}

-- Phone Permissions Configuration
Config.Permissions = {
    -- Admin permissions
    admin = {
        bypassPhoneItem = true,
        viewAllMessages = true,
        moderateBusinesses = true,
        systemSettings = true
    },
    
    -- User permissions
    user = {
        maxContacts = 500,
        maxNotes = 100,
        maxPhotos = 50,
        maxPlaylists = 20,
        maxAlarms = 10
    }
}

-- Phone Limits Configuration
Config.Limits = {
    -- Message limits
    messages = {
        maxLength = 1000,
        maxAttachments = 5,
        cooldown = 1 -- seconds
    },
    
    -- Call limits
    calls = {
        maxDuration = 3600, -- seconds
        maxParticipants = 2
    },
    
    -- Photo limits
    photos = {
        maxSize = 5, -- MB
        maxDimensions = "1920x1080",
        maxPerDay = 100
    }
}

-- Phone Backup Configuration
Config.Backup = {
    enabled = true,
    autoBackup = true,
    backupInterval = 86400, -- seconds (24 hours)
    maxBackups = 7,
    backupLocation = "backups/"
}

-- Phone Logging Configuration
Config.Logging = {
    enabled = true,
    level = "info", -- debug, info, warn, error
    logFile = "phone.log",
    maxLogSize = 10, -- MB
    maxLogFiles = 5
}
