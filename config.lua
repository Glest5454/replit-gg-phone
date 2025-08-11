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
    yellowpages = true
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
    hangupCommand = "hangup"
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
    ox_inventory = true -- Ox inventory integration
}

-- Phone Item Configuration
Config.PhoneItem = {
    name = "phone",
    useable = true,
    shouldClose = false,
    combinable = nil
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
