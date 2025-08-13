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
AddEventHandler('gg-phone:server:addContact', function(name, phoneNumber)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.insert('INSERT INTO phone_contacts (owner_id, name, phone_number, created_at) VALUES (?, ?, ?, NOW())', {
        citizenId, name, phoneNumber
    }, function(insertId)
        if insertId then
            TriggerClientEvent('gg-phone:client:contactAdded', src, {
                id = insertId,
                name = name,
                phoneNumber = phoneNumber
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
    local targetPlayer = QBCore.Functions.GetPlayerByPhone(targetNumber)
    
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
    local targetPlayer = QBCore.Functions.GetPlayerByPhone(targetNumber)
    
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
    
    local targetPlayer = QBCore.Functions.GetPlayerByPhone(targetNumber)
    
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

-- Twitter Events
RegisterServerEvent('gg-phone:server:twitterRegister')
AddEventHandler('gg-phone:server:twitterRegister', function(username, email, password, displayName)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    -- Check if username or email exists
    MySQL.query('SELECT id FROM twitter_accounts WHERE username = ? OR email = ?', {username, email}, function(result)
        if #result > 0 then
            TriggerClientEvent('gg-phone:client:twitterError', src, 'Username or email already exists')
        else
            -- Hash password (in production, use proper hashing)
            local passwordHash = password -- TODO: Implement proper hashing
            
            MySQL.insert('INSERT INTO twitter_accounts (username, email, password_hash, display_name, avatar, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())', {
                username, email, passwordHash, displayName, string.sub(displayName, 1, 2):upper(), citizenId
            }, function(insertId)
                if insertId then
                    TriggerClientEvent('gg-phone:client:twitterRegistered', src, {
                        id = insertId,
                        username = username,
                        displayName = displayName
                    })
                end
            end)
        end
    end)
end)

RegisterServerEvent('gg-phone:server:twitterLogin')
AddEventHandler('gg-phone:server:twitterLogin', function(username, password)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    -- Check credentials
    MySQL.query('SELECT * FROM twitter_accounts WHERE username = ? AND password_hash = ?', {username, password}, function(result)
        if #result > 0 then
            local account = result[1]
            
            -- Update last login
            MySQL.update('UPDATE twitter_accounts SET last_login = NOW() WHERE id = ?', {account.id})
            
            TriggerClientEvent('gg-phone:client:twitterLoggedIn', src, {
                id = account.id,
                username = account.username,
                displayName = account.display_name,
                avatar = account.avatar,
                bio = account.bio,
                verified = account.verified,
                followersCount = account.followers_count,
                followingCount = account.following_count
            })
        else
            TriggerClientEvent('gg-phone:client:twitterError', src, 'Invalid credentials')
        end
    end)
end)

RegisterServerEvent('gg-phone:server:postTweet')
AddEventHandler('gg-phone:server:postTweet', function(content, imageUrl, location)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    -- Get user's twitter account
    MySQL.query('SELECT * FROM twitter_accounts WHERE user_id = ?', {citizenId}, function(result)
        if #result > 0 then
            local twitterAccount = result[1]
            
            MySQL.insert('INSERT INTO twitter_tweets (author_id, content, image_url, location, created_at) VALUES (?, ?, ?, ?, NOW())', {
                twitterAccount.id, content, imageUrl, location
            }, function(insertId)
                if insertId then
                    TriggerClientEvent('gg-phone:client:tweetPosted', src, {
                        id = insertId,
                        content = content,
                        imageUrl = imageUrl,
                        location = location
                    })
                    
                    -- Broadcast to all players
                    TriggerClientEvent('gg-phone:client:newTweet', -1, {
                        id = insertId,
                        content = content,
                        imageUrl = imageUrl,
                        location = location,
                        author = twitterAccount.display_name,
                        username = twitterAccount.username,
                        avatar = twitterAccount.avatar,
                        verified = twitterAccount.verified,
                        time = 'now'
                    })
                end
            end)
        else
            TriggerClientEvent('gg-phone:client:twitterError', src, 'No Twitter account found')
        end
    end)
end)

RegisterServerEvent('gg-phone:server:getTweets')
AddEventHandler('gg-phone:server:getTweets', function()
    local src = source
    
    MySQL.query([[
        SELECT 
            t.*,
            ta.username,
            ta.display_name,
            ta.avatar,
            ta.verified,
            ta.followers_count,
            ta.following_count
        FROM twitter_tweets t
        JOIN twitter_accounts ta ON t.author_id = ta.id
        WHERE t.is_deleted = 0
        ORDER BY t.created_at DESC
        LIMIT 50
    ]], {}, function(result)
        TriggerClientEvent('gg-phone:client:tweetsLoaded', src, result)
    end)
end)

RegisterServerEvent('gg-phone:server:likeTweet')
AddEventHandler('gg-phone:server:likeTweet', function(tweetId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    -- Get user's twitter account
    MySQL.query('SELECT id FROM twitter_accounts WHERE user_id = ?', {citizenId}, function(result)
        if #result > 0 then
            local twitterAccountId = result[1].id
            
            -- Check if already liked
            MySQL.query('SELECT id FROM twitter_tweet_likes WHERE tweet_id = ? AND user_id = ?', {tweetId, twitterAccountId}, function(likes)
                if #likes > 0 then
                    -- Unlike
                    MySQL.update('DELETE FROM twitter_tweet_likes WHERE tweet_id = ? AND user_id = ?', {tweetId, twitterAccountId})
                    MySQL.update('UPDATE twitter_tweets SET likes_count = likes_count - 1 WHERE id = ?', {tweetId})
                    TriggerClientEvent('gg-phone:client:tweetUnliked', src, tweetId)
                else
                    -- Like
                    MySQL.insert('INSERT INTO twitter_tweet_likes (tweet_id, user_id) VALUES (?, ?)', {tweetId, twitterAccountId})
                    MySQL.update('UPDATE twitter_tweets SET likes_count = likes_count + 1 WHERE id = ?', {tweetId})
                    TriggerClientEvent('gg-phone:client:tweetLiked', src, tweetId)
                end
            end)
        end
    end)
end)

RegisterServerEvent('gg-phone:server:retweetTweet')
AddEventHandler('gg-phone:server:retweetTweet', function(tweetId)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    -- Get user's twitter account
    MySQL.query('SELECT id FROM twitter_accounts WHERE user_id = ?', {citizenId}, function(result)
        if #result > 0 then
            local twitterAccountId = result[1].id
            
            -- Check if already retweeted
            MySQL.query('SELECT id FROM twitter_tweet_retweets WHERE tweet_id = ? AND user_id = ?', {tweetId, twitterAccountId}, function(retweets)
                if #retweets > 0 then
                    -- Unretweet
                    MySQL.update('DELETE FROM twitter_tweet_retweets WHERE tweet_id = ? AND user_id = ?', {tweetId, twitterAccountId})
                    MySQL.update('UPDATE twitter_tweets SET retweets_count = retweets_count - 1 WHERE id = ?', {tweetId})
                    TriggerClientEvent('gg-phone:client:tweetUnretweeted', src, tweetId)
                else
                    -- Retweet
                    MySQL.insert('INSERT INTO twitter_tweet_retweets (tweet_id, user_id) VALUES (?, ?)', {tweetId, twitterAccountId})
                    MySQL.update('UPDATE twitter_tweets SET retweets_count = retweets_count + 1 WHERE id = ?', {tweetId})
                    TriggerClientEvent('gg-phone:client:tweetRetweeted', src, tweetId)
                end
            end)
        end
    end)
end)

RegisterServerEvent('gg-phone:server:updateTwitterProfile')
AddEventHandler('gg-phone:server:updateTwitterProfile', function(displayName, bio, avatar)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT id FROM twitter_accounts WHERE user_id = ?', {citizenId}, function(result)
        if #result > 0 then
            local twitterAccountId = result[1].id
            
            MySQL.update('UPDATE twitter_accounts SET display_name = ?, bio = ?, avatar = ? WHERE id = ?', {
                displayName, bio, avatar, twitterAccountId
            }, function(affectedRows)
                if affectedRows > 0 then
                    TriggerClientEvent('gg-phone:client:profileUpdated', src, {
                        displayName = displayName,
                        bio = bio,
                        avatar = avatar
                    })
                end
            end)
        end
    end)
end)

RegisterServerEvent('gg-phone:server:changeTwitterPassword')
AddEventHandler('gg-phone:server:changeTwitterPassword', function(currentPassword, newPassword)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT id FROM twitter_accounts WHERE user_id = ? AND password_hash = ?', {citizenId, currentPassword}, function(result)
        if #result > 0 then
            local twitterAccountId = result[1].id
            
            -- Hash new password (in production, use proper hashing)
            local newPasswordHash = newPassword -- TODO: Implement proper hashing
            
            MySQL.update('UPDATE twitter_accounts SET password_hash = ? WHERE id = ?', {
                newPasswordHash, twitterAccountId
            }, function(affectedRows)
                if affectedRows > 0 then
                    TriggerClientEvent('gg-phone:client:passwordChanged', src)
                end
            end)
        else
            TriggerClientEvent('gg-phone:client:twitterError', src, 'Current password is incorrect')
        end
    end)
end)

RegisterServerEvent('gg-phone:server:twitterLogout')
AddEventHandler('gg-phone:server:twitterLogout', function()
    local src = source
    TriggerClientEvent('gg-phone:client:twitterLoggedOut', src)
end)

-- Mail Events
RegisterServerEvent('gg-phone:server:createMailAccount')
AddEventHandler('gg-phone:server:createMailAccount', function(email, password, displayName)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT id FROM mail_accounts WHERE email = ?', {email}, function(result)
        if #result > 0 then
            TriggerClientEvent('gg-phone:client:mailError', src, 'Email already exists')
        else
            MySQL.insert('INSERT INTO mail_accounts (user_id, email, password, display_name, created_at) VALUES (?, ?, ?, ?, NOW())', {
                citizenId, email, password, displayName
            }, function(insertId)
                if insertId then
                    TriggerClientEvent('gg-phone:client:mailAccountCreated', src, {
                        id = insertId,
                        email = email,
                        displayName = displayName
                    })
                end
            end)
        end
    end)
end)

RegisterServerEvent('gg-phone:server:sendMail')
AddEventHandler('gg-phone:server:sendMail', function(receiverEmail, subject, content)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT id FROM mail_accounts WHERE user_id = ?', {citizenId}, function(result)
        if #result > 0 then
            local senderAccountId = result[1].id
            
            MySQL.insert('INSERT INTO phone_mails (sender_id, receiver_email, subject, content, created_at) VALUES (?, ?, ?, ?, NOW())', {
                senderAccountId, receiverEmail, subject, content
            }, function(insertId)
                if insertId then
                    TriggerClientEvent('gg-phone:client:mailSent', src, {
                        id = insertId,
                        receiverEmail = receiverEmail,
                        subject = subject,
                        content = content
                    })
                end
            end)
        else
            TriggerClientEvent('gg-phone:client:mailError', src, 'No mail account found')
        end
    end)
end)

-- Mail Login
RegisterServerEvent('gg-phone:server:loginMailAccount')
AddEventHandler('gg-phone:server:loginMailAccount', function(email, password)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT * FROM mail_accounts WHERE email = ? AND password = ? AND user_id = ?', {email, password, citizenId}, function(result)
        if #result > 0 then
            TriggerClientEvent('gg-phone:client:mailAccountLoggedIn', src, result[1])
        else
            TriggerClientEvent('gg-phone:client:mailError', src, 'Invalid email or password')
        end
    end)
end)

-- Get Emails for current account
RegisterServerEvent('gg-phone:server:getEmails')
AddEventHandler('gg-phone:server:getEmails', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    
    local citizenId = Player.PlayerData.citizenid
    
    MySQL.query('SELECT ma.id, ma.email, ma.display_name FROM mail_accounts ma WHERE ma.user_id = ?', {citizenId}, function(accounts)
        if #accounts > 0 then
            local accountId = accounts[1].id
            
            -- Get received emails
            MySQL.query([[
                SELECT 
                    pm.id,
                    pm.sender_id,
                    pm.receiver_email,
                    pm.subject,
                    pm.content,
                    pm.read,
                    pm.starred,
                    pm.created_at,
                    ma.email as sender_email,
                    ma.display_name as sender_name
                FROM phone_mails pm
                JOIN mail_accounts ma ON pm.sender_id = ma.id
                WHERE pm.receiver_email = ?
                ORDER BY pm.created_at DESC
                LIMIT 100
            ]], {accounts[1].email}, function(receivedEmails)
                
                -- Get sent emails
                MySQL.query([[
                    SELECT 
                        pm.id,
                        pm.sender_id,
                        pm.receiver_email,
                        pm.subject,
                        pm.content,
                        pm.read,
                        pm.starred,
                        pm.created_at,
                        'sent' as direction
                    FROM phone_mails pm
                    WHERE pm.sender_id = ?
                    ORDER BY pm.created_at DESC
                    LIMIT 100
                ]], {accountId}, function(sentEmails)
                    
                    -- Combine and format emails
                    local allEmails = {}
                    
                    -- Add received emails
                    for i, email in ipairs(receivedEmails) do
                        email.direction = 'received'
                        table.insert(allEmails, email)
                    end
                    
                    -- Add sent emails
                    for i, email in ipairs(sentEmails) do
                        table.insert(allEmails, email)
                    end
                    
                    -- Sort by creation date
                    table.sort(allEmails, function(a, b)
                        return a.created_at > b.created_at
                    end)
                    
                    TriggerClientEvent('gg-phone:client:emailsLoaded', src, allEmails)
                end)
            end)
        else
            TriggerClientEvent('gg-phone:client:mailError', src, 'No mail account found')
        end
    end)
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