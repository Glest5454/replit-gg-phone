fx_version 'cerulean'
game 'gta5'

author 'Your Name'
description 'Samsung Galaxy S25 Phone Script with One UI 7 Design'
version '1.0.0'

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
    'html/dist/assets/**/*'
}

dependencies {
    'oxmysql'
}

lua54 'yes'
