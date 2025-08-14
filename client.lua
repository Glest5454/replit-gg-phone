-- Samsung Galaxy S25 Phone Script - Client Side
local QBCore = exports['qb-core']:GetCoreObject()

local phoneOpen = false
local phoneData = {}
local isPhoneItem = Config.PhoneItem and Config.PhoneItem.useable

-- Phone UI Functions
function OpenPhone()
    if not phoneOpen then
        -- Check if player has phone item if enabled
        if isPhoneItem then
            local hasPhone = QBCore.Functions.HasItem(Config.PhoneItem.name)
            if not hasPhone then
                QBCore.Functions.Notify('You need a phone to use this feature', 'error')
                return
            end
        end
        
        phoneOpen = true
        SetNuiFocus(true, true)
        
        -- Get QBCore player data including phone number
        local playerData = QBCore.Functions.GetPlayerData()
        local phoneNumber = playerData.charinfo and playerData.charinfo.phone or "Unknown"
        local playerName = playerData.charinfo and (playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname) or "Unknown"
        
        SendNUIMessage({
            action = 'openPhone',
            playerData = {
                ...playerData,
                phoneNumber = phoneNumber,
                playerName = playerName
            }
        })
        
        -- Load initial data
        TriggerServerEvent('gg-phone:server:getNotes')
        TriggerServerEvent('gg-phone:server:getContacts')
        TriggerServerEvent('gg-phone:server:getTransactions')
        TriggerServerEvent('gg-phone:server:getPhotos')
        
        -- Trigger phone opened event for other resources
        TriggerEvent('gg-phone:client:phoneOpened')
    end
end

function ClosePhone()
    if phoneOpen then
        phoneOpen = false
        SetNuiFocus(false, false)
        SendNUIMessage({
            action = 'closePhone'
        })
        
        -- Trigger phone closed event for other resources
        TriggerEvent('gg-phone:client:phoneClosed')
    end
end

-- CFX Native Functions
function IsPhoneOpen()
    return phoneOpen
end

function GetPhoneData()
    return phoneData
end

-- Export functions for other resources
exports('IsPhoneOpen', IsPhoneOpen)
exports('GetPhoneData', GetPhoneData)
exports('OpenPhone', OpenPhone)
exports('ClosePhone', ClosePhone)

-- Keybind to open phone
RegisterCommand('phone', function()
    if not phoneOpen then
        OpenPhone()
    else
        ClosePhone()
    end
end)

RegisterKeyMapping('phone', 'Open Phone', 'keyboard', Config.PhoneSettings.openKey)

-- NUI Callbacks
RegisterNUICallback('closePhone', function(data, cb)
    ClosePhone()
    cb('ok')
end)

-- Banking Callbacks
RegisterNUICallback('bankDeposit', function(data, cb)
    TriggerServerEvent('gg-phone:server:deposit', data.amount, data.description)
    cb('ok')
end)

RegisterNUICallback('bankWithdraw', function(data, cb)
    TriggerServerEvent('gg-phone:server:withdraw', data.amount, data.description)
    cb('ok')
end)

RegisterNUICallback('bankTransfer', function(data, cb)
    TriggerServerEvent('gg-phone:server:transfer', data.targetAccount, data.amount, data.description)
    cb('ok')
end)

-- Notes Callbacks
RegisterNUICallback('createNote', function(data, cb)
    TriggerServerEvent('gg-phone:server:createNote', data.title, data.content, data.color)
    cb('ok')
end)

RegisterNUICallback('updateNote', function(data, cb)
    TriggerServerEvent('gg-phone:server:updateNote', data.id, data.title, data.content, data.color)
    cb('ok')
end)

RegisterNUICallback('deleteNote', function(data, cb)
    TriggerServerEvent('gg-phone:server:deleteNote', data.id)
    cb('ok')
end)

-- Contacts Callbacks
RegisterNUICallback('addContact', function(data, cb)
    TriggerServerEvent('gg-phone:server:addContact', data.name, data.phoneNumber, data.avatar, data.favorite)
    cb('ok')
end)

RegisterNUICallback('updateContact', function(data, cb)
    TriggerServerEvent('gg-phone:server:updateContact', data.id, data.name, data.phoneNumber, data.avatar, data.favorite)
    cb('ok')
end)

RegisterNUICallback('deleteContact', function(data, cb)
    TriggerServerEvent('gg-phone:server:deleteContact', data.id)
    cb('ok')
end)

RegisterNUICallback('callContact', function(data, cb)
    TriggerServerEvent('gg-phone:server:startCall', data.phoneNumber)
    cb('ok')
end)

RegisterNUICallback('endCall', function(data, cb)
    TriggerServerEvent('gg-phone:server:endCall')
    cb('ok')
end)

-- Messages Callbacks
RegisterNUICallback('sendMessage', function(data, cb)
    TriggerServerEvent('gg-phone:server:sendMessage', data.targetNumber, data.message, data.messageType, data.metadata)
    cb('ok')
end)

RegisterNUICallback('getMessages', function(data, cb)
    TriggerServerEvent('gg-phone:server:getMessages', data.targetNumber)
    cb('ok')
end)

RegisterNUICallback('getAllMessages', function(data, cb)
    TriggerServerEvent('gg-phone:server:getAllMessages')
    cb('ok')
end)

-- Twitter Callbacks
RegisterNUICallback('twitterRegister', function(data, cb)
    TriggerServerEvent('gg-phone:server:twitterRegister', data.username, data.email, data.password, data.displayName)
    cb('ok')
end)

RegisterNUICallback('twitterLogin', function(data, cb)
    TriggerServerEvent('gg-phone:server:twitterLogin', data.username, data.password)
    cb('ok')
end)

RegisterNUICallback('postTweet', function(data, cb)
    TriggerServerEvent('gg-phone:server:postTweet', data.content, data.imageUrl, data.location)
    cb('ok')
end)

RegisterNUICallback('getTweets', function(data, cb)
    TriggerServerEvent('gg-phone:server:getTweets')
    cb('ok')
end)

RegisterNUICallback('likeTweet', function(data, cb)
    TriggerServerEvent('gg-phone:server:likeTweet', data.tweetId)
    cb('ok')
end)

RegisterNUICallback('retweetTweet', function(data, cb)
    TriggerServerEvent('gg-phone:server:retweetTweet', data.tweetId)
    cb('ok')
end)

RegisterNUICallback('updateTwitterProfile', function(data, cb)
    TriggerServerEvent('gg-phone:server:updateTwitterProfile', data.displayName, data.bio, data.avatar)
    cb('ok')
end)

RegisterNUICallback('changeTwitterPassword', function(data, cb)
    TriggerServerEvent('gg-phone:server:changeTwitterPassword', data.currentPassword, data.newPassword)
    cb('ok')
end)

RegisterNUICallback('twitterLogout', function(data, cb)
    TriggerServerEvent('gg-phone:server:twitterLogout')
    cb('ok')
end)

-- Mail Callbacks
RegisterNUICallback('createMailAccount', function(data, cb)
    TriggerServerEvent('gg-phone:server:createMailAccount', data.email, data.password, data.displayName)
    cb('ok')
end)

RegisterNUICallback('sendMail', function(data, cb)
    TriggerServerEvent('gg-phone:server:sendMail', data.receiverEmail, data.subject, data.content)
    cb('ok')
end)

RegisterNUICallback('loginMailAccount', function(data, cb)
    TriggerServerEvent('gg-phone:server:loginMailAccount', data.email, data.password)
    cb('ok')
end)

RegisterNUICallback('getEmails', function(data, cb)
    TriggerServerEvent('gg-phone:server:getEmails')
    cb('ok')
end)

-- Camera Callbacks with Screenshot-basic
RegisterNUICallback('takePhoto', function(data, cb)
    if Config.Integrations.screenshot_basic then
        -- Use screenshot-basic
        exports['screenshot-basic']:requestScreenshotUpload(GetConvar('screenshot-basic:url', ''), 'files[]', function(data)
            local resp = json.decode(data)
            if resp and resp.files and resp.files[1] then
                local imageUrl = resp.files[1]
                TriggerServerEvent('gg-phone:server:savePhoto', imageUrl, data.filter, data.effects, data.cssFilter)
            else
                TriggerEvent('gg-phone:client:cameraError', 'Failed to upload photo')
            end
        end)
    else
        -- Fallback to server-side screenshot
        TriggerServerEvent('gg-phone:server:takePhoto', data.filter, data.effects, data.cssFilter)
    end
    cb('ok')
end)

RegisterNUICallback('getPhotos', function(data, cb)
    TriggerServerEvent('gg-phone:server:getPhotos')
    cb('ok')
end)

RegisterNUICallback('deletePhoto', function(data, cb)
    TriggerServerEvent('gg-phone:server:deletePhoto', data.photoId)
    cb('ok')
end)

-- Gallery Callbacks
RegisterNUICallback('savePhotoToGallery', function(data, cb)
    TriggerServerEvent('gg-phone:server:savePhotoToGallery', data.photoUrl, data.metadata)
    cb('ok')
end)

-- Notes App Enhanced Callbacks
RegisterNUICallback('getNoteCategories', function(data, cb)
    TriggerServerEvent('gg-phone:server:getNoteCategories')
    cb('ok')
end)

RegisterNUICallback('createNoteCategory', function(data, cb)
    TriggerServerEvent('gg-phone:server:createNoteCategory', data.name, data.color)
    cb('ok')
end)

-- Calculator Callbacks
RegisterNUICallback('saveCalculation', function(data, cb)
    TriggerServerEvent('gg-phone:server:saveCalculation', data.expression, data.result)
    cb('ok')
end)

RegisterNUICallback('getCalculationHistory', function(data, cb)
    TriggerServerEvent('gg-phone:server:getCalculationHistory')
    cb('ok')
end)

-- Clock App Callbacks
RegisterNUICallback('setAlarm', function(data, cb)
    TriggerServerEvent('gg-phone:server:setAlarm', data.time, data.days, data.label, data.sound)
    cb('ok')
end)

RegisterNUICallback('getAlarms', function(data, cb)
    TriggerServerEvent('gg-phone:server:getAlarms')
    cb('ok')
end)

RegisterNUICallback('deleteAlarm', function(data, cb)
    TriggerServerEvent('gg-phone:server:deleteAlarm', data.alarmId)
    cb('ok')
end)

-- Spotify App Callbacks
RegisterNUICallback('savePlaylist', function(data, cb)
    TriggerServerEvent('gg-phone:server:savePlaylist', data.name, data.songs, data.isPublic)
    cb('ok')
end)

RegisterNUICallback('getPlaylists', function(data, cb)
    TriggerServerEvent('gg-phone:server:getPlaylists')
    cb('ok')
end)

-- Yellow Pages Callbacks
RegisterNUICallback('registerBusiness', function(data, cb)
    TriggerServerEvent('gg-phone:server:registerBusiness', data.name, data.category, data.description, data.phone, data.address)
    cb('ok')
end)

RegisterNUICallback('getBusinesses', function(data, cb)
    TriggerServerEvent('gg-phone:server:getBusinesses', data.category)
    cb('ok')
end)

-- Settings Callbacks
RegisterNUICallback('savePhoneSettings', function(data, cb)
    TriggerServerEvent('gg-phone:server:savePhoneSettings', data.settings)
    cb('ok')
end)

RegisterNUICallback('getPhoneSettings', function(data, cb)
    TriggerServerEvent('gg-phone:server:getPhoneSettings')
    cb('ok')
end)

-- Server Event Handlers
RegisterNetEvent('gg-phone:client:transactionSuccess')
AddEventHandler('gg-phone:client:transactionSuccess', function(transaction)
    SendNUIMessage({
        action = 'transactionSuccess',
        transaction = transaction
    })
    QBCore.Functions.Notify('Transaction completed successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:transactionError')
AddEventHandler('gg-phone:client:transactionError', function(error)
    SendNUIMessage({
        action = 'transactionError',
        error = error
    })
    QBCore.Functions.Notify('Transaction failed: ' .. error, 'error')
end)

RegisterNetEvent('gg-phone:client:noteCreated')
AddEventHandler('gg-phone:client:noteCreated', function(note)
    SendNUIMessage({
        action = 'noteCreated',
        note = note
    })
    QBCore.Functions.Notify('Note created successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:noteUpdated')
AddEventHandler('gg-phone:client:noteUpdated', function(note)
    SendNUIMessage({
        action = 'noteUpdated',
        note = note
    })
    QBCore.Functions.Notify('Note updated successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:noteDeleted')
AddEventHandler('gg-phone:client:noteDeleted', function(noteId)
    SendNUIMessage({
        action = 'noteDeleted',
        noteId = noteId
    })
    QBCore.Functions.Notify('Note deleted successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:contactAdded')
AddEventHandler('gg-phone:client:contactAdded', function(contact)
    SendNUIMessage({
        action = 'contactAdded',
        contact = contact
    })
    QBCore.Functions.Notify('Contact added successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:contactUpdated')
AddEventHandler('gg-phone:client:contactUpdated', function(contact)
    SendNUIMessage({
        action = 'contactUpdated',
        contact = contact
    })
    QBCore.Functions.Notify('Contact updated successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:contactDeleted')
AddEventHandler('gg-phone:client:contactDeleted', function(contactId)
    SendNUIMessage({
        action = 'contactDeleted',
        contactId = contactId
    })
    QBCore.Functions.Notify('Contact deleted successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:messageSent')
AddEventHandler('gg-phone:client:messageSent', function(message)
    SendNUIMessage({
        action = 'messageSent',
        message = message
    })
end)

RegisterNetEvent('gg-phone:client:messageReceived')
AddEventHandler('gg-phone:client:messageReceived', function(message)
    SendNUIMessage({
        action = 'messageReceived',
        message = message
    })
    QBCore.Functions.Notify('New message received', 'primary')
end)

RegisterNetEvent('gg-phone:client:messagesLoaded')
AddEventHandler('gg-phone:client:messagesLoaded', function(data)
    SendNUIMessage({
        action = 'messagesLoaded',
        targetNumber = data.targetNumber,
        messages = data.messages
    })
end)

RegisterNetEvent('gg-phone:client:allMessagesLoaded')
AddEventHandler('gg-phone:client:allMessagesLoaded', function(conversations)
    SendNUIMessage({
        action = 'allMessagesLoaded',
        conversations = conversations
    })
end)

RegisterNetEvent('gg-phone:client:callStarted')
AddEventHandler('gg-phone:client:callStarted', function(targetNumber)
    SendNUIMessage({
        action = 'callStarted',
        targetNumber = targetNumber
    })
end)

RegisterNetEvent('gg-phone:client:incomingCall')
AddEventHandler('gg-phone:client:incomingCall', function(callerNumber)
    SendNUIMessage({
        action = 'incomingCall',
        callerNumber = callerNumber
    })
end)

RegisterNetEvent('gg-phone:client:callEnded')
AddEventHandler('gg-phone:client:callEnded', function()
    SendNUIMessage({
        action = 'callEnded'
    })
end)

-- Twitter Event Handlers
RegisterNetEvent('gg-phone:client:twitterRegistered')
AddEventHandler('gg-phone:client:twitterRegistered', function(account)
    SendNUIMessage({
        action = 'twitterRegistered',
        account = account
    })
    QBCore.Functions.Notify('Twitter account created successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:twitterLoggedIn')
AddEventHandler('gg-phone:client:twitterLoggedIn', function(account)
    SendNUIMessage({
        action = 'twitterLoggedIn',
        account = account
    })
    QBCore.Functions.Notify('Welcome back, ' .. account.displayName, 'success')
end)

RegisterNetEvent('gg-phone:client:twitterLoggedOut')
AddEventHandler('gg-phone:client:twitterLoggedOut', function()
    SendNUIMessage({
        action = 'twitterLoggedOut'
    })
    QBCore.Functions.Notify('Logged out from Twitter', 'primary')
end)

RegisterNetEvent('gg-phone:client:tweetPosted')
AddEventHandler('gg-phone:client:tweetPosted', function(tweet)
    SendNUIMessage({
        action = 'tweetPosted',
        tweet = tweet
    })
    QBCore.Functions.Notify('Tweet posted successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:newTweet')
AddEventHandler('gg-phone:client:newTweet', function(tweet)
    SendNUIMessage({
        action = 'newTweet',
        tweet = tweet
    })
end)

RegisterNetEvent('gg-phone:client:tweetsLoaded')
AddEventHandler('gg-phone:client:tweetsLoaded', function(tweets)
    SendNUIMessage({
        action = 'tweetsLoaded',
        tweets = tweets
    })
end)

RegisterNetEvent('gg-phone:client:tweetLiked')
AddEventHandler('gg-phone:client:tweetLiked', function(tweetId)
    SendNUIMessage({
        action = 'tweetLiked',
        tweetId = tweetId
    })
end)

RegisterNetEvent('gg-phone:client:tweetUnliked')
AddEventHandler('gg-phone:client:tweetUnliked', function(tweetId)
    SendNUIMessage({
        action = 'tweetUnliked',
        tweetId = tweetId
    })
end)

RegisterNetEvent('gg-phone:client:tweetRetweeted')
AddEventHandler('gg-phone:client:tweetRetweeted', function(tweetId)
    SendNUIMessage({
        action = 'tweetRetweeted',
        tweetId = tweetId
    })
end)

RegisterNetEvent('gg-phone:client:tweetUnretweeted')
AddEventHandler('gg-phone:client:tweetUnretweeted', function(tweetId)
    SendNUIMessage({
        action = 'tweetUnretweeted',
        tweetId = tweetId
    })
end)

RegisterNetEvent('gg-phone:client:profileUpdated')
AddEventHandler('gg-phone:client:profileUpdated', function(profile)
    SendNUIMessage({
        action = 'profileUpdated',
        profile = profile
    })
    QBCore.Functions.Notify('Profile updated successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:passwordChanged')
AddEventHandler('gg-phone:client:passwordChanged', function()
    SendNUIMessage({
        action = 'passwordChanged'
    })
    QBCore.Functions.Notify('Password changed successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:twitterError')
AddEventHandler('gg-phone:client:twitterError', function(error)
    SendNUIMessage({
        action = 'twitterError',
        error = error
    })
    QBCore.Functions.Notify('Twitter error: ' .. error, 'error')
end)

RegisterNetEvent('gg-phone:client:mailAccountCreated')
AddEventHandler('gg-phone:client:mailAccountCreated', function(account)
    SendNUIMessage({
        action = 'mailAccountCreated',
        account = account
    })
    QBCore.Functions.Notify('Mail account created successfully', 'success')
end)

RegisterNetEvent('gg-phone:client:mailSent')
AddEventHandler('gg-phone:client:mailSent', function(mail)
    SendNUIMessage({
        action = 'mailSent',
        mail = mail
    })
    QBCore.Functions.Notify('Mail sent successfully', 'success')
end)

-- Data Loading Events
RegisterNetEvent('gg-phone:client:notesLoaded')
AddEventHandler('gg-phone:client:notesLoaded', function(notes)
    SendNUIMessage({
        action = 'notesLoaded',
        notes = notes
    })
end)

RegisterNetEvent('gg-phone:client:contactsLoaded')
AddEventHandler('gg-phone:client:contactsLoaded', function(contacts)
    SendNUIMessage({
        action = 'contactsLoaded',
        contacts = contacts
    })
end)

RegisterNetEvent('gg-phone:client:transactionsLoaded')
AddEventHandler('gg-phone:client:transactionsLoaded', function(transactions)
    SendNUIMessage({
        action = 'transactionsLoaded',
        transactions = transactions
    })
end)

-- Camera Event Handlers
RegisterNetEvent('gg-phone:client:photoTaken')
AddEventHandler('gg-phone:client:photoTaken', function(photo)
    SendNUIMessage({
        action = 'photoTaken',
        photo = photo
    })
end)

RegisterNetEvent('gg-phone:client:photosLoaded')
AddEventHandler('gg-phone:client:photosLoaded', function(photos)
    SendNUIMessage({
        action = 'photosLoaded',
        photos = photos
    })
end)

RegisterNetEvent('gg-phone:client:cameraError')
AddEventHandler('gg-phone:client:cameraError', function(error)
    SendNUIMessage({
        action = 'cameraError',
        error = error
    })
end)

-- Enhanced App Data Events
RegisterNetEvent('gg-phone:client:noteCategoriesLoaded')
AddEventHandler('gg-phone:client:noteCategoriesLoaded', function(categories)
    SendNUIMessage({
        action = 'noteCategoriesLoaded',
        categories = categories
    })
end)

RegisterNetEvent('gg-phone:client:calculationHistoryLoaded')
AddEventHandler('gg-phone:client:calculationHistoryLoaded', function(calculations)
    SendNUIMessage({
        action = 'calculationHistoryLoaded',
        calculations = calculations
    })
end)

RegisterNetEvent('gg-phone:client:alarmsLoaded')
AddEventHandler('gg-phone:client:alarmsLoaded', function(alarms)
    SendNUIMessage({
        action = 'alarmsLoaded',
        alarms = alarms
    })
end)

RegisterNetEvent('gg-phone:client:playlistsLoaded')
AddEventHandler('gg-phone:client:playlistsLoaded', function(playlists)
    SendNUIMessage({
        action = 'playlistsLoaded',
        playlists = playlists
    })
end)

RegisterNetEvent('gg-phone:client:businessesLoaded')
AddEventHandler('gg-phone:client:businessesLoaded', function(businesses)
    SendNUIMessage({
        action = 'businessesLoaded',
        businesses = businesses
    })
end)

RegisterNetEvent('gg-phone:client:phoneSettingsLoaded')
AddEventHandler('gg-phone:client:phoneSettingsLoaded', function(settings)
    SendNUIMessage({
        action = 'phoneSettingsLoaded',
        settings = settings
    })
end)

-- pma-voice Integration Events
RegisterNetEvent('gg-phone:client:voiceCallStarted')
AddEventHandler('gg-phone:client:voiceCallStarted', function(targetNumber)
    SendNUIMessage({
        action = 'voiceCallStarted',
        targetNumber = targetNumber
    })
end)

RegisterNetEvent('gg-phone:client:voiceCallEnded')
AddEventHandler('gg-phone:client:voiceCallEnded', function()
    SendNUIMessage({
        action = 'voiceCallEnded'
    })
end)

-- Utility Functions
function GetPhoneNumber()
    local playerData = QBCore.Functions.GetPlayerData()
    return playerData.charinfo and playerData.charinfo.phone or "Unknown"
end

function GetPlayerName()
    local playerData = QBCore.Functions.GetPlayerData()
    return playerData.charinfo and (playerData.charinfo.firstname .. " " .. playerData.charinfo.lastname) or "Unknown"
end

-- Export utility functions
exports('GetPhoneNumber', GetPhoneNumber)
exports('GetPlayerName', GetPlayerName)

