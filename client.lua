local QBCore = nil
local ESX = nil

-- Framework Detection
if Config.Framework == "qb-core" then
    QBCore = exports['qb-core']:GetCoreObject()
elseif Config.Framework == "esx" then
    ESX = exports["es_extended"]:getSharedObject()
end

-- Variables
local phoneOpen = false
local phoneData = {}
local playerData = {}
local currentCall = nil

-- NUI Callbacks
RegisterNUICallback('closePhone', function(data, cb)
    ClosePhone()
    cb('ok')
end)

RegisterNUICallback('getPhoneData', function(data, cb)
    local playerData = GetPlayerData()
    cb({
        citizenId = playerData.citizenid or playerData.identifier,
        phoneNumber = playerData.charinfo and playerData.charinfo.phone or playerData.phone,
        name = GetPlayerName()
    })
end)

-- Contacts
RegisterNUICallback('getContacts', function(data, cb)
    TriggerServerEvent('phone:server:getContacts')
    cb('ok')
end)

RegisterNUICallback('addContact', function(data, cb)
    TriggerServerEvent('phone:server:addContact', data)
    cb('ok')
end)

RegisterNUICallback('deleteContact', function(data, cb)
    TriggerServerEvent('phone:server:deleteContact', data.id)
    cb('ok')
end)

RegisterNUICallback('updateContact', function(data, cb)
    TriggerServerEvent('phone:server:updateContact', data)
    cb('ok')
end)

-- Messages
RegisterNUICallback('getMessages', function(data, cb)
    TriggerServerEvent('phone:server:getMessages')
    cb('ok')
end)

RegisterNUICallback('sendMessage', function(data, cb)
    TriggerServerEvent('phone:server:sendMessage', data)
    cb('ok')
end)

RegisterNUICallback('markMessageRead', function(data, cb)
    TriggerServerEvent('phone:server:markMessageRead', data.id)
    cb('ok')
end)

-- Phone Calls
RegisterNUICallback('startCall', function(data, cb)
    local phoneNumber = data.phoneNumber
    TriggerServerEvent('phone:server:startCall', phoneNumber)
    cb('ok')
end)

RegisterNUICallback('endCall', function(data, cb)
    TriggerServerEvent('phone:server:endCall')
    cb('ok')
end)

RegisterNUICallback('acceptCall', function(data, cb)
    TriggerServerEvent('phone:server:acceptCall')
    cb('ok')
end)

RegisterNUICallback('declineCall', function(data, cb)
    TriggerServerEvent('phone:server:declineCall')
    cb('ok')
end)

-- Banking
RegisterNUICallback('getBankAccount', function(data, cb)
    TriggerServerEvent('phone:server:getBankAccount')
    cb('ok')
end)

RegisterNUICallback('getTransactions', function(data, cb)
    TriggerServerEvent('phone:server:getTransactions')
    cb('ok')
end)

RegisterNUICallback('bankTransfer', function(data, cb)
    TriggerServerEvent('phone:server:bankTransfer', data)
    cb('ok')
end)

RegisterNUICallback('bankDeposit', function(data, cb)
    TriggerServerEvent('phone:server:bankDeposit', data)
    cb('ok')
end)

RegisterNUICallback('bankWithdraw', function(data, cb)
    TriggerServerEvent('phone:server:bankWithdraw', data)
    cb('ok')
end)

-- Twitter/Warble
RegisterNUICallback('getTweets', function(data, cb)
    TriggerServerEvent('phone:server:getTweets', data)
    cb('ok')
end)

RegisterNUICallback('postTweet', function(data, cb)
    TriggerServerEvent('phone:server:postTweet', data)
    cb('ok')
end)

RegisterNUICallback('likeTweet', function(data, cb)
    TriggerServerEvent('phone:server:likeTweet', data.id)
    cb('ok')
end)

RegisterNUICallback('retweetTweet', function(data, cb)
    TriggerServerEvent('phone:server:retweetTweet', data.id)
    cb('ok')
end)

-- Notes
RegisterNUICallback('getNotes', function(data, cb)
    TriggerServerEvent('phone:server:getNotes')
    cb('ok')
end)

RegisterNUICallback('saveNote', function(data, cb)
    TriggerServerEvent('phone:server:saveNote', data)
    cb('ok')
end)

RegisterNUICallback('deleteNote', function(data, cb)
    TriggerServerEvent('phone:server:deleteNote', data.id)
    cb('ok')
end)

-- Camera & Gallery
RegisterNUICallback('takePhoto', function(data, cb)
    TriggerServerEvent('phone:server:takePhoto')
    cb('ok')
end)

RegisterNUICallback('getPhotos', function(data, cb)
    TriggerServerEvent('phone:server:getPhotos')
    cb('ok')
end)

RegisterNUICallback('deletePhoto', function(data, cb)
    TriggerServerEvent('phone:server:deletePhoto', data.id)
    cb('ok')
end)

-- Yellow Pages
RegisterNUICallback('searchBusinesses', function(data, cb)
    TriggerServerEvent('phone:server:searchBusinesses', data)
    cb('ok')
end)

RegisterNUICallback('registerBusiness', function(data, cb)
    TriggerServerEvent('phone:server:registerBusiness', data)
    cb('ok')
end)

-- Settings
RegisterNUICallback('updateSettings', function(data, cb)
    TriggerServerEvent('phone:server:updateSettings', data)
    cb('ok')
end)

-- Functions
function GetPlayerData()
    if Config.Framework == "qb-core" then
        return QBCore.Functions.GetPlayerData()
    elseif Config.Framework == "esx" then
        return ESX.GetPlayerData()
    end
    return {}
end

function OpenPhone()
    if phoneOpen then return end
    
    local playerData = GetPlayerData()
    if not playerData then return end

    phoneOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "openPhone",
        data = {
            citizenId = playerData.citizenid or playerData.identifier,
            phoneNumber = playerData.charinfo and playerData.charinfo.phone or playerData.phone,
            name = GetPlayerName(),
            settings = Config.DefaultSettings
        }
    })

    -- Animation
    CreateThread(function()
        local ped = PlayerPedId()
        local phoneModel = GetHashKey("prop_phone_01")
        
        RequestModel(phoneModel)
        while not HasModelLoaded(phoneModel) do
            Wait(100)
        end

        local phone = CreateObject(phoneModel, 0, 0, 0, true, true, true)
        AttachEntityToEntity(phone, ped, GetPedBoneIndex(ped, 57005), 0.14, 0.01, -0.02, 110.0, 120.0, -15.0, true, true, false, true, 1, true)
        
        -- Store phone object for cleanup
        phoneData.phoneObject = phone
    end)
end

function ClosePhone()
    if not phoneOpen then return end
    
    phoneOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = "closePhone"
    })

    -- Clean up phone object
    if phoneData.phoneObject then
        DeleteObject(phoneData.phoneObject)
        phoneData.phoneObject = nil
    end
end

-- Events from Server
RegisterNetEvent('phone:client:updateContacts', function(contacts)
    SendNUIMessage({
        action = "updateContacts",
        data = contacts
    })
end)

RegisterNetEvent('phone:client:updateMessages', function(messages)
    SendNUIMessage({
        action = "updateMessages",
        data = messages
    })
end)

RegisterNetEvent('phone:client:newMessage', function(message)
    SendNUIMessage({
        action = "newMessage",
        data = message
    })
    
    -- Show notification
    if Config.PhoneSettings.enableNotifications then
        SendNUIMessage({
            action = "showNotification",
            data = {
                title = "New Message",
                message = message.message,
                sender = message.senderName,
                icon = "message"
            }
        })
    end
end)

RegisterNetEvent('phone:client:incomingCall', function(callerData)
    currentCall = callerData
    SendNUIMessage({
        action = "incomingCall",
        data = callerData
    })
end)

RegisterNetEvent('phone:client:callAccepted', function()
    SendNUIMessage({
        action = "callAccepted"
    })
end)

RegisterNetEvent('phone:client:callEnded', function()
    currentCall = nil
    SendNUIMessage({
        action = "callEnded"
    })
end)

RegisterNetEvent('phone:client:updateBankAccount', function(account)
    SendNUIMessage({
        action = "updateBankAccount",
        data = account
    })
end)

RegisterNetEvent('phone:client:updateTransactions', function(transactions)
    SendNUIMessage({
        action = "updateTransactions",
        data = transactions
    })
end)

RegisterNetEvent('phone:client:updateTweets', function(tweets)
    SendNUIMessage({
        action = "updateTweets",
        data = tweets
    })
end)

RegisterNetEvent('phone:client:updateNotes', function(notes)
    SendNUIMessage({
        action = "updateNotes",
        data = notes
    })
end)

RegisterNetEvent('phone:client:updatePhotos', function(photos)
    SendNUIMessage({
        action = "updatePhotos",
        data = photos
    })
end)

RegisterNetEvent('phone:client:updateBusinesses', function(businesses)
    SendNUIMessage({
        action = "updateBusinesses",
        data = businesses
    })
end)

RegisterNetEvent('phone:client:showNotification', function(notification)
    SendNUIMessage({
        action = "showNotification",
        data = notification
    })
end)

-- Key Mapping
RegisterKeyMapping('phone', 'Open/Close Phone', 'keyboard', Config.PhoneSettings.openKey)

RegisterCommand('phone', function()
    if phoneOpen then
        ClosePhone()
    else
        OpenPhone()
    end
end, false)

-- Item Usage (QBCore)
if Config.Framework == "qb-core" then
    RegisterNetEvent('phone:client:use', function()
        if phoneOpen then
            ClosePhone()
        else
            OpenPhone()
        end
    end)
end

-- Item Usage (ESX)
if Config.Framework == "esx" then
    RegisterNetEvent('phone:use', function()
        if phoneOpen then
            ClosePhone()
        else
            OpenPhone()
        end
    end)
end

-- Cleanup on resource stop
AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        if phoneOpen then
            ClosePhone()
        end
        if phoneData.phoneObject then
            DeleteObject(phoneData.phoneObject)
        end
    end
end)

-- Exports
exports('IsPhoneOpen', function()
    return phoneOpen
end)

exports('OpenPhone', OpenPhone)
exports('ClosePhone', ClosePhone)
