-- Samsung Galaxy S25 Phone Script - Server Side
-- Dependencies: oxmysql, QBCore/ESX

local QBCore = exports['qb-core']:GetCoreObject()

-- Banking Events
RegisterServerEvent('gg-phone:server:deposit')
AddEventHandler('gg-phone:server:deposit', function(amount, description)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    amount = tonumber(amount)
    
    if amount and amount > 0 then
        -- Add money to player account (adjust according to your banking system)
        Player.Functions.AddMoney('bank', amount, description or 'Phone Deposit')
        
        -- Log transaction in database
        MySQL.insert('INSERT INTO phone_transactions (user_id, type, amount, description, created_at) VALUES (?, ?, ?, ?, NOW())', {
            citizenId, 'deposit', amount, description or 'Phone Deposit'
        })
        
        TriggerClientEvent('gg-phone:client:transactionSuccess', src, {
            type = 'deposit',
            amount = amount,
            description = description
        })
    else
        TriggerClientEvent('gg-phone:client:transactionError', src, 'Invalid amount')
    end
end)

RegisterServerEvent('gg-phone:server:withdraw')
AddEventHandler('gg-phone:server:withdraw', function(amount, description)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    amount = tonumber(amount)
    
    if amount and amount > 0 then
        local bankMoney = Player.PlayerData.money.bank
        
        if bankMoney >= amount then
            Player.Functions.RemoveMoney('bank', amount, description or 'Phone Withdrawal')
            
            MySQL.insert('INSERT INTO phone_transactions (user_id, type, amount, description, created_at) VALUES (?, ?, ?, ?, NOW())', {
                citizenId, 'withdraw', amount, description or 'Phone Withdrawal'
            })
            
            TriggerClientEvent('gg-phone:client:transactionSuccess', src, {
                type = 'withdraw',
                amount = amount,
                description = description
            })
        else
            TriggerClientEvent('gg-phone:client:transactionError', src, 'Insufficient funds')
        end
    else
        TriggerClientEvent('gg-phone:client:transactionError', src, 'Invalid amount')
    end
end)

RegisterServerEvent('gg-phone:server:transfer')
AddEventHandler('gg-phone:server:transfer', function(targetAccount, amount, description)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    amount = tonumber(amount)
    
    if amount and amount > 0 and targetAccount then
        local bankMoney = Player.PlayerData.money.bank
        
        if bankMoney >= amount then
            -- Find target player by phone number or citizen ID
            local targetPlayer = QBCore.Functions.GetPlayerByCitizenId(targetAccount)
            
            if targetPlayer then
                Player.Functions.RemoveMoney('bank', amount, description or 'Phone Transfer')
                targetPlayer.Functions.AddMoney('bank', amount, description or 'Phone Transfer Received')
                
                -- Log both transactions
                MySQL.insert('INSERT INTO phone_transactions (user_id, type, amount, description, target_account, created_at) VALUES (?, ?, ?, ?, ?, NOW())', {
                    citizenId, 'transfer', amount, description or 'Phone Transfer', targetAccount
                })
                
                TriggerClientEvent('gg-phone:client:transactionSuccess', src, {
                    type = 'transfer',
                    amount = amount,
                    targetAccount = targetAccount,
                    description = description
                })
            else
                TriggerClientEvent('gg-phone:client:transactionError', src, 'Target account not found')
            end
        else
            TriggerClientEvent('gg-phone:client:transactionError', src, 'Insufficient funds')
        end
    else
        TriggerClientEvent('gg-phone:client:transactionError', src, 'Invalid transfer data')
    end
end)

-- Notes Events
RegisterServerEvent('gg-phone:server:createNote')
AddEventHandler('gg-phone:server:createNote', function(title, content, color)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.insert('INSERT INTO phone_notes (user_id, title, content, color, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())', {
        citizenId, title, content, color or '#fbbf24'
    }, function(insertId)
        if insertId then
            TriggerClientEvent('gg-phone:client:noteCreated', src, {
                id = insertId,
                title = title,
                content = content,
                color = color
            })
        end
    end)
end)

RegisterServerEvent('gg-phone:server:updateNote')
AddEventHandler('gg-phone:server:updateNote', function(noteId, title, content, color)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.update('UPDATE phone_notes SET title = ?, content = ?, color = ?, updated_at = NOW() WHERE id = ? AND user_id = ?', {
        title, content, color, noteId, citizenId
    }, function(affectedRows)
        if affectedRows > 0 then
            TriggerClientEvent('gg-phone:client:noteUpdated', src, {
                id = noteId,
                title = title,
                content = content,
                color = color
            })
        end
    end)
end)

RegisterServerEvent('gg-phone:server:deleteNote')
AddEventHandler('gg-phone:server:deleteNote', function(noteId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.update('DELETE FROM phone_notes WHERE id = ? AND user_id = ?', {
        noteId, citizenId
    }, function(affectedRows)
        if affectedRows > 0 then
            TriggerClientEvent('gg-phone:client:noteDeleted', src, noteId)
        end
    end)
end)

-- Contacts Events
RegisterServerEvent('gg-phone:server:addContact')
AddEventHandler('gg-phone:server:addContact', function(name, phoneNumber, avatar, favorite)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.insert('INSERT INTO phone_contacts (owner_id, name, phone_number, avatar, favorite, created_at) VALUES (?, ?, ?, ?, ?, NOW())', {
        citizenId, name, phoneNumber, avatar or '', favorite or false
    }, function(insertId)
        if insertId then
            TriggerClientEvent('gg-phone:client:contactAdded', src, {
                id = insertId,
                name = name,
                phoneNumber = phoneNumber,
                avatar = avatar,
                favorite = favorite
            })
        end
    end)
end)

-- Messages Events
RegisterServerEvent('gg-phone:server:sendMessage')
AddEventHandler('gg-phone:server:sendMessage', function(targetNumber, message, messageType, metadata)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    local senderNumber = Player.PlayerData.charinfo.phone
    
    -- Find target player by phone number
    local targetPlayer = GetPlayerByPhone(targetNumber)
    
    if targetPlayer then
        local targetCitizenId = targetPlayer.PlayerData.citizenid
        
        -- Prepare metadata JSON
        local metadataJson = nil
        if metadata then
            metadataJson = json.encode(metadata)
        end
        
        MySQL.insert('INSERT INTO phone_messages (sender_id, receiver_id, message, message_type, metadata, timestamp) VALUES (?, ?, ?, ?, ?, NOW())', {
            citizenId, targetCitizenId, message, messageType or 'text', metadataJson
        }, function(insertId)
            if insertId then
                -- Notify sender
                TriggerClientEvent('gg-phone:client:messageSent', src, {
                    id = insertId,
                    targetNumber = targetNumber,
                    message = message,
                    messageType = messageType,
                    metadata = metadata
                })
                
                -- Notify receiver
                TriggerClientEvent('gg-phone:client:messageReceived', targetPlayer.PlayerData.source, {
                    id = insertId,
                    senderNumber = senderNumber,
                    message = message,
                    messageType = messageType,
                    metadata = metadata
                })
            end
        end)
    else
        TriggerClientEvent('gg-phone:client:messageError', src, 'Phone number not found')
    end
end)

-- Get Messages for a conversation
RegisterServerEvent('gg-phone:server:getMessages')
AddEventHandler('gg-phone:server:getMessages', function(targetNumber)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    -- Find target player by phone number
    local targetPlayer = GetPlayerByPhone(targetNumber)
    
    if targetPlayer then
        local targetCitizenId = targetPlayer.PlayerData.citizenid
        
        -- Get messages between these two players
        MySQL.query([[
            SELECT 
                pm.id,
                pm.sender_id,
                pm.receiver_id,
                pm.message,
                pm.message_type,
                pm.metadata,
                pm.timestamp,
                pm.is_read,
                CASE 
                    WHEN pm.sender_id = ? THEN 'outgoing'
                    ELSE 'incoming'
                END as message_direction
            FROM phone_messages pm
            WHERE (pm.sender_id = ? AND pm.receiver_id = ?)
               OR (pm.sender_id = ? AND pm.receiver_id = ?)
            ORDER BY pm.timestamp ASC
            LIMIT 100
        ]], {
            citizenId, citizenId, targetCitizenId, targetCitizenId, citizenId
        }, function(result)
            -- Parse metadata JSON for each message
            for i, message in ipairs(result) do
                if message.metadata then
                    message.metadata = json.decode(message.metadata)
                end
            end
            
            TriggerClientEvent('gg-phone:client:messagesLoaded', src, {
                targetNumber = targetNumber,
                messages = result
            })
        end)
    else
        TriggerClientEvent('gg-phone:client:messageError', src, 'Phone number not found')
    end
end)

-- Get All Messages (for Messages app)
RegisterServerEvent('gg-phone:server:getAllMessages')
AddEventHandler('gg-phone:server:getAllMessages', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    -- Get all conversations with last message
    MySQL.query([[
        SELECT 
            c.id,
            c.name,
            c.phone_number,
            c.avatar,
            c.favorite,
            c.last_contact,
            pm.message as last_message,
            pm.message_type as last_message_type,
            pm.metadata as last_message_metadata,
            pm.timestamp as last_message_time,
            COUNT(CASE WHEN pm.is_read = 0 AND pm.receiver_id = ? THEN 1 END) as unread_count
        FROM phone_contacts c
        LEFT JOIN phone_messages pm ON (
            (pm.sender_id = ? AND pm.receiver_id = c.owner_id) OR
            (pm.sender_id = c.owner_id AND pm.receiver_id = ?)
        )
        WHERE c.owner_id = ?
        GROUP BY c.id, c.name, c.phone_number, c.avatar, c.favorite, c.last_contact
        ORDER BY pm.timestamp DESC
    ]], {
        citizenId, citizenId, citizenId, citizenId
    }, function(result)
        -- Parse metadata JSON for each conversation
        for i, conv in ipairs(result) do
            if conv.last_message_metadata then
                conv.last_message_metadata = json.decode(conv.last_message_metadata)
            end
        end
        
        TriggerClientEvent('gg-phone:client:allMessagesLoaded', src, result)
    end)
end)

-- Voice Call Events (pma-voice integration)
RegisterServerEvent('gg-phone:server:startCall')
AddEventHandler('gg-phone:server:startCall', function(targetNumber)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local targetPlayer = GetPlayerByPhone(targetNumber)
    
    if targetPlayer then
        -- Start voice call using pma-voice
        exports['pma-voice']:addPlayerToCall(src, 'phone-' .. src)
        exports['pma-voice']:addPlayerToCall(targetPlayer.PlayerData.source, 'phone-' .. src)
        
        TriggerClientEvent('gg-phone:client:callStarted', src, targetNumber)
        TriggerClientEvent('gg-phone:client:incomingCall', targetPlayer.PlayerData.source, Player.PlayerData.charinfo.phone)
    else
        TriggerClientEvent('gg-phone:client:callError', src, 'Phone number not found')
    end
end)

RegisterServerEvent('gg-phone:server:endCall')
AddEventHandler('gg-phone:server:endCall', function()
    local src = source
    
    -- Remove from voice call
    exports['pma-voice']:removePlayerFromCall(src)
    
    TriggerClientEvent('gg-phone:client:callEnded', src)
end)

-- Get Data Events
RegisterServerEvent('gg-phone:server:getNotes')
AddEventHandler('gg-phone:server:getNotes', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT * FROM phone_notes WHERE user_id = ? ORDER BY updated_at DESC', {citizenId}, function(result)
        TriggerClientEvent('gg-phone:client:notesLoaded', src, result)
    end)
end)

RegisterServerEvent('gg-phone:server:getContacts')
AddEventHandler('gg-phone:server:getContacts', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT * FROM phone_contacts WHERE owner_id = ? ORDER BY name ASC', {citizenId}, function(result)
        TriggerClientEvent('gg-phone:client:contactsLoaded', src, result)
    end)
end)

RegisterServerEvent('gg-phone:server:getTransactions')
AddEventHandler('gg-phone:server:getTransactions', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT * FROM phone_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', {citizenId}, function(result)
        TriggerClientEvent('gg-phone:client:transactionsLoaded', src, result)
    end)
end)

RegisterServerEvent('gg-phone:server:getPhotos')
AddEventHandler('gg-phone:server:getPhotos', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT * FROM phone_photos WHERE user_id = ? ORDER BY created_at DESC', {citizenId}, function(result)
        TriggerClientEvent('gg-phone:client:photosLoaded', src, result)
    end)
end)

-- Enhanced Contact Events
RegisterServerEvent('gg-phone:server:updateContact')
AddEventHandler('gg-phone:server:updateContact', function(contactId, name, phoneNumber, avatar, favorite)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.update('UPDATE phone_contacts SET name = ?, phone_number = ?, avatar = ?, favorite = ? WHERE id = ? AND owner_id = ?', {
        name, phoneNumber, avatar or '', favorite or false, contactId, citizenId
    }, function(affectedRows)
        if affectedRows > 0 then
            TriggerClientEvent('gg-phone:client:contactUpdated', src, {
                id = contactId,
                name = name,
                phoneNumber = phoneNumber,
                avatar = avatar,
                favorite = favorite
            })
        end
    end)
end)

RegisterServerEvent('gg-phone:server:deleteContact')
AddEventHandler('gg-phone:server:deleteContact', function(contactId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.update('DELETE FROM phone_contacts WHERE id = ? AND owner_id = ?', {
        contactId, citizenId
    }, function(affectedRows)
        if affectedRows > 0 then
            TriggerClientEvent('gg-phone:client:contactDeleted', src, contactId)
        end
    end)
end)

-- Enhanced Notes Events
RegisterServerEvent('gg-phone:server:createNoteCategory')
AddEventHandler('gg-phone:server:createNoteCategory', function(name, color)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.insert('INSERT INTO phone_note_categories (user_id, name, color, created_at) VALUES (?, ?, ?, NOW())', {
        citizenId, name, color or '#fbbf24'
    }, function(insertId)
        if insertId then
            TriggerClientEvent('gg-phone:client:noteCategoryCreated', src, {
                id = insertId,
                name = name,
                color = color
            })
        end
    end)
end)

RegisterServerEvent('gg-phone:server:getNoteCategories')
AddEventHandler('gg-phone:server:getNoteCategories', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT * FROM phone_note_categories WHERE user_id = ? ORDER BY name ASC', {citizenId}, function(result)
        TriggerClientEvent('gg-phone:client:noteCategoriesLoaded', src, result)
    end)
end)

-- Calculator Events
RegisterServerEvent('gg-phone:server:saveCalculation')
AddEventHandler('gg-phone:server:saveCalculation', function(expression, result)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.insert('INSERT INTO phone_calculations (user_id, expression, result, created_at) VALUES (?, ?, ?, NOW())', {
        citizenId, expression, result
    })
end)

RegisterServerEvent('gg-phone:server:getCalculationHistory')
AddEventHandler('gg-phone:server:getCalculationHistory', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT * FROM phone_calculations WHERE user_id = ? ORDER BY created_at DESC LIMIT 20', {citizenId}, function(result)
        TriggerClientEvent('gg-phone:client:calculationHistoryLoaded', src, result)
    end)
end)

-- Clock App Events
RegisterServerEvent('gg-phone:server:setAlarm')
AddEventHandler('gg-phone:server:setAlarm', function(time, days, label, sound)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.insert('INSERT INTO phone_alarms (user_id, time, days, label, sound, created_at) VALUES (?, ?, ?, ?, ?, NOW())', {
        citizenId, time, days or '{}', label or 'Alarm', sound or 'default'
    }, function(insertId)
        if insertId then
            TriggerClientEvent('gg-phone:client:alarmSet', src, {
                id = insertId,
                time = time,
                days = days,
                label = label,
                sound = sound
            })
        end
    end)
end)

RegisterServerEvent('gg-phone:server:getAlarms')
AddEventHandler('gg-phone:server:getAlarms', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT * FROM phone_alarms WHERE user_id = ? ORDER BY time ASC', {citizenId}, function(result)
        TriggerClientEvent('gg-phone:client:alarmsLoaded', src, result)
    end)
end)

RegisterServerEvent('gg-phone:server:deleteAlarm')
AddEventHandler('gg-phone:server:deleteAlarm', function(alarmId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.update('DELETE FROM phone_alarms WHERE id = ? AND user_id = ?', {
        alarmId, citizenId
    }, function(affectedRows)
        if affectedRows > 0 then
            TriggerClientEvent('gg-phone:client:alarmDeleted', src, alarmId)
        end
    end)
end)

-- Spotify App Events
RegisterServerEvent('gg-phone:server:savePlaylist')
AddEventHandler('gg-phone:server:savePlaylist', function(name, songs, isPublic)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    local songsJson = json.encode(songs or {})
    
    MySQL.insert('INSERT INTO phone_playlists (user_id, name, songs, is_public, created_at) VALUES (?, ?, ?, ?, NOW())', {
        citizenId, name, songsJson, isPublic or false
    }, function(insertId)
        if insertId then
            TriggerClientEvent('gg-phone:client:playlistSaved', src, {
                id = insertId,
                name = name,
                songs = songs,
                isPublic = isPublic
            })
        end
    end)
end)

RegisterServerEvent('gg-phone:server:getPlaylists')
AddEventHandler('gg-phone:server:getPlaylists', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT * FROM phone_playlists WHERE user_id = ? OR is_public = 1 ORDER BY created_at DESC', {citizenId}, function(result)
        -- Parse songs JSON for each playlist
        for i, playlist in ipairs(result) do
            if playlist.songs then
                playlist.songs = json.decode(playlist.songs)
            end
        end
        
        TriggerClientEvent('gg-phone:client:playlistsLoaded', src, result)
    end)
end)

-- Yellow Pages Events
RegisterServerEvent('gg-phone:server:registerBusiness')
AddEventHandler('gg-phone:server:registerBusiness', function(name, category, description, phone, address)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    -- Check if player has enough money for registration fee
    if Player.PlayerData.money.cash < Config.YellowPages.registrationFee then
        TriggerClientEvent('gg-phone:client:businessError', src, 'Insufficient funds for registration fee')
        return
    end
    
    -- Check business limit per player
    MySQL.query('SELECT COUNT(*) as count FROM phone_businesses WHERE owner_id = ?', {citizenId}, function(result)
        if result[1].count >= Config.YellowPages.maxBusinessesPerPlayer then
            TriggerClientEvent('gg-phone:client:businessError', src, 'Maximum business limit reached')
            return
        end
        
        -- Deduct registration fee
        Player.Functions.RemoveMoney('cash', Config.YellowPages.registrationFee, 'Business Registration Fee')
        
        MySQL.insert('INSERT INTO phone_businesses (owner_id, name, category, description, phone, address, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())', {
            citizenId, name, category, description, phone, address, Config.YellowPages.moderationRequired and 'pending' or 'approved'
        }, function(insertId)
            if insertId then
                TriggerClientEvent('gg-phone:client:businessRegistered', src, {
                    id = insertId,
                    name = name,
                    category = category,
                    description = description,
                    phone = phone,
                    address = address
                })
            end
        end)
    end)
end)

RegisterServerEvent('gg-phone:server:getBusinesses')
AddEventHandler('gg-phone:server:getBusinesses', function(category)
    local src = source
    
    local query = 'SELECT * FROM phone_businesses WHERE status = "approved"'
    local params = {}
    
    if category and category ~= 'all' then
        query = query .. ' AND category = ?'
        table.insert(params, category)
    end
    
    query = query .. ' ORDER BY created_at DESC'
    
    MySQL.query(query, params, function(result)
        TriggerClientEvent('gg-phone:client:businessesLoaded', src, result)
    end)
end)

-- Phone Settings Events
RegisterServerEvent('gg-phone:server:savePhoneSettings')
AddEventHandler('gg-phone:server:savePhoneSettings', function(settings)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    local settingsJson = json.encode(settings)
    
    MySQL.update('INSERT INTO phone_settings (user_id, settings, updated_at) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE settings = ?, updated_at = NOW()', {
        citizenId, settingsJson, settingsJson
    }, function(affectedRows)
        if affectedRows > 0 then
            TriggerClientEvent('gg-phone:client:phoneSettingsSaved', src, settings)
        end
    end)
end)

RegisterServerEvent('gg-phone:server:getPhoneSettings')
AddEventHandler('gg-phone:server:getPhoneSettings', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT settings FROM phone_settings WHERE user_id = ?', {citizenId}, function(result)
        if #result > 0 and result[1].settings then
            local settings = json.decode(result[1].settings)
            TriggerClientEvent('gg-phone:client:phoneSettingsLoaded', src, settings)
        else
            -- Return default settings
            TriggerClientEvent('gg-phone:client:phoneSettingsLoaded', src, Config.DefaultSettings)
        end
    end)
end)

-- Enhanced Photo Events with Screenshot-basic
RegisterServerEvent('gg-phone:server:savePhoto')
AddEventHandler('gg-phone:server:savePhoto', function(imageUrl, filter, effects, cssFilter)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.insert('INSERT INTO phone_photos (user_id, image_url, filter, effects, css_filter, created_at) VALUES (?, ?, ?, ?, ?, NOW())', {
        citizenId, imageUrl, filter or '', effects or '', cssFilter or ''
    }, function(insertId)
        if insertId then
            TriggerClientEvent('gg-phone:client:photoSaved', src, {
                id = insertId,
                imageUrl = imageUrl,
                filter = filter,
                effects = effects,
                cssFilter = cssFilter
            })
        end
    end)
end)

RegisterServerEvent('gg-phone:server:deletePhoto')
AddEventHandler('gg-phone:server:deletePhoto', function(photoId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.update('DELETE FROM phone_photos WHERE id = ? AND user_id = ?', {
        photoId, citizenId
    }, function(affectedRows)
        if affectedRows > 0 then
            TriggerClientEvent('gg-phone:client:photoDeleted', src, photoId)
        end
    end)
end)

-- Enhanced pma-voice Integration
RegisterServerEvent('gg-phone:server:startVoiceCall')
AddEventHandler('gg-phone:server:startVoiceCall', function(targetNumber)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local targetPlayer = GetPlayerByPhone(targetNumber)
    
    if targetPlayer then
        -- Create unique call ID
        local callId = 'phone-' .. src .. '-' .. GetGameTimer()
        
        -- Add both players to voice call
        exports['pma-voice']:addPlayerToCall(src, callId)
        exports['pma-voice']:addPlayerToCall(targetPlayer.PlayerData.source, callId)
        
        -- Store call data
        phoneData[callId] = {
            caller = src,
            receiver = targetPlayer.PlayerData.source,
            startTime = GetGameTimer(),
            status = 'active'
        }
        
        TriggerClientEvent('gg-phone:client:voiceCallStarted', src, targetNumber)
        TriggerClientEvent('gg-phone:client:incomingVoiceCall', targetPlayer.PlayerData.source, Player.PlayerData.charinfo.phone)
    else
        TriggerClientEvent('gg-phone:client:callError', src, 'Phone number not found')
    end
end)

RegisterServerEvent('gg-phone:server:endVoiceCall')
AddEventHandler('gg-phone:server:endVoiceCall', function()
    local src = source
    
    -- Find and end the call
    for callId, callData in pairs(phoneData) do
        if callData.caller == src or callData.receiver == src then
            -- Remove both players from call
            exports['pma-voice']:removePlayerFromCall(callData.caller)
            exports['pma-voice']:removePlayerFromCall(callData.receiver)
            
            -- Update call status
            callData.status = 'ended'
            callData.endTime = GetGameTimer()
            
            -- Notify both players
            TriggerClientEvent('gg-phone:client:voiceCallEnded', callData.caller)
            TriggerClientEvent('gg-phone:client:voiceCallEnded', callData.receiver)
            
            break
        end
    end
end)

-- Utility Functions
function GetPlayerByPhone(phoneNumber)
    local players = QBCore.Functions.GetPlayers()
    for _, playerId in ipairs(players) do
        local player = QBCore.Functions.GetPlayer(playerId)
        if player and player.PlayerData.charinfo.phone == phoneNumber then
            return player
        end
    end
    return nil
end

-- Export functions for other resources
exports('GetPlayerByPhone', GetPlayerByPhone)
exports('IsPlayerOnCall', function(playerId)
    for callId, callData in pairs(phoneData) do
        if callData.caller == playerId or callData.receiver == playerId then
            return true, callId
        end
    end
    return false, nil
end)