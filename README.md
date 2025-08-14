# Samsung Galaxy S25 Phone Script - Enhanced Edition

A modern, feature-rich phone script for FiveM servers with Samsung One UI 7 design, enhanced with CFX natives, screenshot-basic integration, and pma-voice support.

## 🚀 Features

### Core Phone Features
- **Modern Samsung One UI 7 Design** - Beautiful, responsive interface
- **Lock Screen System** - PIN-based security with customizable settings
- **Home Screen** - Drag & drop app reordering with persistent storage
- **Task Manager** - Recent apps management with swipe gestures
- **Notification System** - Real-time notifications with sound and vibration

### Enhanced Apps
- **Contacts** - Full CRUD operations with avatars and favorites
- **Messages** - Rich messaging with metadata support
- **Camera & Gallery** - Screenshot-basic integration for photo capture
- **Notes** - Categorized notes with color coding
- **Calculator** - History tracking and persistent calculations
- **Clock** - Alarm system with custom sounds and schedules
- **Banking** - Secure financial transactions
- **Twitter** - Social media integration
- **Spotify** - Playlist management
- **Yellow Pages** - Business directory with registration system
- **Mail** - Email client with account management

### Technical Features
- **CFX Native Support** - Export functions for other resources
- **Inventory Integration** - Phone item requirement system
- **Screenshot-basic** - Advanced photo capture and storage
- **pma-voice** - Voice call integration
- **Database Persistence** - MySQL/oxmysql support
- **Responsive Design** - Mobile-first approach
- **Performance Optimized** - Efficient rendering and state management

## 📋 Requirements

### Server Requirements
- FiveM Server (Build 2802+)
- MySQL Database (5.7+)
- oxmysql resource

### Dependencies
- `qb-core` - QBCore framework
- `oxmysql` - Database management
- `screenshot-basic` - Photo capture
- `pma-voice` - Voice communication

## 🛠️ Installation

### 1. Download & Extract
```bash
# Download the resource
cd resources
git clone [repository-url] gg-phone
cd gg-phone
```

### 2. Database Setup
```sql
-- Import the database schema
mysql -u username -p database_name < install.sql
```

### 3. Configure Dependencies
Ensure all required resources are started in your `server.cfg`:
```cfg
ensure oxmysql
ensure qb-core
ensure screenshot-basic
ensure pma-voice
ensure gg-phone
```

### 4. Configure the Script
Edit `config.lua` to match your server settings:
```lua
Config.Framework = "qb-core"  -- or "esx"
Config.PhoneItem.useable = true  -- Require phone item
Config.Integrations.screenshot_basic = true
Config.Integrations.pma_voice = true
```

### 5. Build Frontend
```bash
cd client
npm install
npm run build
```

## 🔧 Configuration

### Phone Item System
```lua
Config.PhoneItem = {
    name = "phone",           -- Item name in inventory
    useable = true,           -- Require item to use phone
    shouldClose = false,
    combinable = nil
}
```

### Screenshot-basic Integration
```lua
Config.ScreenshotBasic = {
    enabled = true,
    uploadUrl = "your-upload-url",
    maxFileSize = 5,          -- MB
    compression = {
        enabled = true,
        quality = 80
    }
}
```

### pma-voice Configuration
```lua
Config.PmaVoice = {
    enabled = true,
    callChannels = {
        prefix = "phone-",
        maxParticipants = 2,
        voiceRange = 20.0
    }
}
```

## 📱 Usage

### Basic Commands
- `/phone` - Open/close phone (or F1 key)
- `/call [number]` - Make a phone call
- `/hangup` - End current call

### CFX Exports
```lua
-- Check if phone is open
local isOpen = exports['gg-phone']:IsPhoneOpen()

-- Open phone programmatically
exports['gg-phone']:OpenPhone()

-- Get player phone number
local phoneNumber = exports['gg-phone']:GetPhoneNumber()

-- Get player name
local playerName = exports['gg-phone']:GetPlayerName()
```

### Server Exports
```lua
-- Find player by phone number
local player = exports['gg-phone']:GetPlayerByPhone("555-0123")

-- Check if player is on call
local onCall, callId = exports['gg-phone']:IsPlayerOnCall(playerId)
```

## 🗄️ Database Structure

The script creates comprehensive database tables for:
- User contacts and messages
- Notes and categories
- Photo storage and metadata
- Banking transactions
- Social media accounts
- Business listings
- System settings and preferences

## 🎨 Customization

### Themes
```lua
Config.UI.theme = {
    primary = "#3b82f6",      -- Blue
    secondary = "#64748b",    -- Gray
    success = "#10b981",      -- Green
    warning = "#f59e0b",      -- Yellow
    error = "#ef4444"         -- Red
}
```

### App Permissions
```lua
Config.AppPermissions = {
    banking = "phone.banking",
    twitter = "phone.twitter",
    yellowpages = "phone.yellowpages.view"
}
```

### Feature Limits
```lua
Config.Limits = {
    messages = {
        maxLength = 1000,
        maxAttachments = 5,
        cooldown = 1
    },
    photos = {
        maxSize = 5,           -- MB
        maxPerDay = 100
    }
}
```

## 🔒 Security Features

- **PIN Lock System** - Configurable security
- **Permission-based Access** - Role-based app access
- **Data Validation** - Input sanitization and validation
- **Rate Limiting** - Anti-spam protection
- **Secure Storage** - Encrypted sensitive data

## 📊 Performance

- **Optimized Rendering** - Efficient React components
- **Lazy Loading** - On-demand data loading
- **Caching System** - Local storage optimization
- **Database Indexing** - Fast query performance
- **Memory Management** - Efficient state handling

## 🐛 Troubleshooting

### Common Issues

1. **Phone won't open**
   - Check if player has phone item (if enabled)
   - Verify all dependencies are started
   - Check console for errors

2. **Photos not saving**
   - Verify screenshot-basic configuration
   - Check upload URL settings
   - Ensure database permissions

3. **Voice calls not working**
   - Verify pma-voice installation
   - Check voice range settings
   - Ensure proper exports

### Debug Mode
```lua
Config.Debug = {
    enabled = true,
    verboseLogging = true
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Credits

- **Design Inspiration** - Samsung One UI 7
- **Framework** - QBCore/ESX
- **UI Components** - React + TypeScript
- **Styling** - Tailwind CSS
- **Icons** - Lucide React

## 📞 Support

- **Discord** - Join our community server
- **Issues** - Report bugs on GitHub
- **Documentation** - Check the wiki for detailed guides

## 🔄 Updates

### Version 1.0.1
- Added CFX native support
- Integrated screenshot-basic
- Added pma-voice support
- Enhanced app functionality
- Improved database structure
- Added comprehensive configuration options

### Version 1.0.0
- Initial release
- Basic phone functionality
- Samsung One UI design
- Core apps implementation

---

**Note**: This script is designed for FiveM servers and requires proper setup of all dependencies. Make sure to test in a development environment before deploying to production.
