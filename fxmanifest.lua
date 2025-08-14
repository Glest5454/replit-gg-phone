fx_version 'cerulean'
game 'gta5'

author 'Your Name'
description 'Samsung Galaxy S25 Phone Script with One UI 7 Design - Enhanced with CFX Natives, Screenshot-basic, and pma-voice'
version '1.0.1'

shared_scripts {
    'config.lua'
}

client_scripts {
    'client.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server.lua'
}

ui_page 'html/dist/index.html'

files {
    'html/dist/index.html',
    'html/dist/assets/*',
    'html/dist/assets/**/*',
}

dependencies {
    'oxmysql',
    'qb-core',
    'screenshot-basic',
    'pma-voice'
}

-- CFX Exports for other resources
exports {
    'IsPhoneOpen',
    'GetPhoneData',
    'OpenPhone',
    'ClosePhone',
    'GetPhoneNumber',
    'GetPlayerName'
}

server_exports {
    'GetPlayerByPhone',
    'IsPlayerOnCall'
}

lua54 'yes'
