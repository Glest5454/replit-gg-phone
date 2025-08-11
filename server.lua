local QBCore = nil
local ESX = nil

-- Framework Detection
if Config.Framework == "qb-core" then
    QBCore = exports['qb-core']:GetCoreObject()
elseif Config.Framework == "esx" then
    ESX = exports["es_extended"]:getSharedObject()
end

-- Utility Functions
function GetPlayer(source)
    if Config.Framework == "qb-core" then
        return QBCore.Functions.GetPlayer(source)
    elseif Config.Framework == "esx" then
        return ESX.GetPlayerFromId(source)
    end
    return nil
end

function GetPlayerIdentifier(source)
    local player = GetPlayer(source)
    if not player then return nil end
    
    if Config.Framework == "qb-core" then
        return player.PlayerData.citizenid
    elseif Config.Framework == "esx" then
        return player.identifier
    end
    return nil
end

function GetPlayerPhone(source)
    local player = GetPlayer(source)
    if not player then return nil end
    
    if Config.Framework == "qb-core" then
        return player.PlayerData.charinfo.phone
    elseif Config.Framework == "esx" then
        return player.phone or "555-0000"
    end
    return nil
end

function GetPlayerMoney(source)
    local player = GetPlayer(source)
    if not player then return 0 end
    
    if Config.Framework == "qb-core" then
        return player.PlayerData.money.bank
    elseif Config.Framework == "esx" then
        return player.getAccount('bank').money
    end
    return 0
end

function AddPlayerMoney(source, amount)
    local player = GetPlayer(source)
    if not player then return false end
    
    if Config.Framework == "qb-core" then
        player.Functions.AddMoney('bank', amount)
        return true
    elseif Config.Framework == "esx" then
        player.addAccountMoney('bank', amount)
        return true
    end
    return false
end

function RemovePlayerMoney(source, amount)
    local player = GetPlayer(source)
    if not player then return false end
    
    if Config.Framework == "qb-core" then
        return player.Functions.RemoveMoney('bank', amount)
    elseif Config.Framework == "esx" then
        if player.getAccount('bank').money >= amount then
            player.removeAccountMoney('bank', amount)
            return true
        end
        return false
    end
    return false
end

-- Database Queries
local function ExecuteQuery(query, parameters)
    if Config.Database.oxmysql then
        return exports.oxmysql:execute_sync(query, parameters or {})
    else
        -- Add support for other database systems here
        print("^1[PHONE] No database system configured!^0")
        return nil
    end
end

local function FetchAll(query, parameters)
    if Config.Database.oxmysql then
        return exports.oxmysql:execute_sync(query, parameters or {})
    else
        print("^1[PHONE] No database system configured!^0")
        return {}
    end
end

-- Initialize Database Tables
CreateThread(function()
    if Config.Database.oxmysql then
        local queries = {
            [[
            CREATE TABLE IF NOT EXISTS `phone_users` (
                `id` varchar(50) NOT NULL,
                `citizen_id` varchar(50) NOT NULL,
                `phone_number` varchar(20) NOT NULL,
                `first_name` varchar(50) NOT NULL,
                `last_name` varchar(50) NOT NULL,
                `settings` longtext DEFAULT NULL,
                `created_at` timestamp NULL DEFAULT current_timestamp(),
                PRIMARY KEY (`id`),
                UNIQUE KEY `citizen_id` (`citizen_id`),
                UNIQUE KEY `phone_number` (`phone_number`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ]],
            [[
            CREATE TABLE IF NOT EXISTS `phone_contacts` (
                `id` varchar(50) NOT NULL,
                `owner_id` varchar(50) NOT NULL,
                `name` varchar(100) NOT NULL,
                `phone_number` varchar(20) NOT NULL,
                `avatar` text DEFAULT NULL,
                `favorite` tinyint(1) DEFAULT 0,
                `created_at` timestamp NULL DEFAULT current_timestamp(),
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ]],
            [[
            CREATE TABLE IF NOT EXISTS `phone_messages` (
                `id` varchar(50) NOT NULL,
                `sender_id` varchar(50) NOT NULL,
                `receiver_id` varchar(50) NOT NULL,
                `message` longtext NOT NULL,
                `read` tinyint(1) DEFAULT 0,
                `created_at` timestamp NULL DEFAULT current_timestamp(),
                PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            ]],
            -- Add more table creation queries here
        }
        
        for _, query in ipairs(queries) do
            ExecuteQuery(query)
        end
        
        print("^2[PHONE] Database tables initialized^0")
    end
end)

-- Phone User Management
RegisterNetEvent('phone:server:initializeUser', function()
    local src = source
    local citizenId = GetPlayerIdentifier(src)
    local phoneNumber = GetPlayerPhone(src)
    
    if not citizenId or not phoneNumber then return end
    
    local existingUser = FetchAll("SELECT * FROM phone_users WHERE citizen_id = ?", {citizenId})
    
    if not existingUser[1] then
        ExecuteQuery("INSERT INTO phone_users (id, citizen_id, phone_number, first_name, last_name, settings) VALUES (?, ?, ?, ?, ?, ?)", {
            GenerateUniqueId(),
            citizenId,
            phoneNumber,
            "John",
            "Doe",
            json.encode(Config.DefaultSettings)
        })
    end
end)

-- Contacts
RegisterNetEvent('phone:server:getContacts', function()
    local src = source
    local citizenId = GetPlayerIdentifier(src)
    
    if not citizenId then return end
    
    local user = FetchAll("SELECT * FROM phone_users WHERE citizen_id = ?", {citizenId})[1]
    if not user then return end
    
    local contacts = FetchAll("SELECT * FROM phone_contacts WHERE owner_id = ? ORDER BY name ASC", {user.id})
    TriggerClientEvent('phone:client:updateContacts', src, contacts)
end)

RegisterNetEvent('phone:server:addContact', function(contactData)
    local src = source
    local citizenId = GetPlayerIdentifier(src)
    
    if not citizenId then return end
    
    local user = FetchAll("SELECT * FROM phone_users WHERE citizen_id = ?", {citizenId})[1]
    if not user then return end
    
    ExecuteQuery("INSERT INTO phone_contacts (id, owner_id, name, phone_number, avatar, favorite) VALUES (?, ?, ?, ?, ?, ?)", {
        GenerateUniqueId(),
        user.id,
        contactData.name,
        contactData.phoneNumber,
        contactData.avatar,
        contactData.favorite or false
    })
    
    TriggerEvent('phone:server:getContacts', src)
end)

RegisterNetEvent('phone:server:deleteContact', function(contactId)
    local src = source
    local citizenId = GetPlayerIdentifier(src)
    
    if not citizenId then return end
    
    ExecuteQuery("DELETE FROM phone_contacts WHERE id = ?", {contactId})
    TriggerEvent('phone:server:getContacts', src)
end)

-- Messages
RegisterNetEvent('phone:server:getMessages', function()
    local src = source
    local citizenId = GetPlayerIdentifier(src)
    
    if not citizenId then return end
    
    local user = FetchAll("SELECT * FROM phone_users WHERE citizen_id = ?", {citizenId})[1]
    if not user then return end
    
    local messages = FetchAll("SELECT * FROM phone_messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at DESC", {user.id, user.id})
    TriggerClientEvent('phone:client:updateMessages', src, messages)
end)

RegisterNetEvent('phone:server:sendMessage', function(messageData)
    local src = source
    local citizenId = GetPlayerIdentifier(src)
    
    if not citizenId then return end
    
    local sender = FetchAll("SELECT * FROM phone_users WHERE citizen_id = ?", {citizenId})[1]
    if not sender then return end
    
    local receiver = FetchAll("SELECT * FROM phone_users WHERE phone_number = ?", {messageData.phoneNumber})[1]
    if not receiver then 
        TriggerClientEvent('phone:client:showNotification', src, {
            title = "Error",
            message = "Phone number not found",
            type = "error"
        })
        return 
    end
    
    local messageId = GenerateUniqueId()
    ExecuteQuery("INSERT INTO phone_messages (id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)", {
        messageId,
        sender.id,
        receiver.id,
        messageData.message
    })
    
    -- Notify receiver if online
    local receiverSource = GetPlayerByCitizenId(receiver.citizen_id)
    if receiverSource then
        TriggerClientEvent('phone:client:newMessage', receiverSource, {
            id = messageId,
            message = messageData.message,
            senderName = sender.first_name .. " " .. sender.last_name,
            senderPhone = sender.phone_number,
            timestamp = os.time()
        })
    end
    
    TriggerEvent('phone:server:getMessages', src)
end)

-- Banking
RegisterNetEvent('phone:server:getBankAccount', function()
    local src = source
    local balance = GetPlayerMoney(src)
    
    TriggerClientEvent('phone:client:updateBankAccount', src, {
        balance = balance,
        accountNumber = "****" .. string.sub(tostring(GetPlayerIdentifier(src)), -4),
        accountHolder = GetPlayerName(src)
    })
end)

RegisterNetEvent('phone:server:bankTransfer', function(transferData)
    local src = source
    local amount = tonumber(transferData.amount)
    
    if amount <= 0 or amount > Config.Banking.maxTransferAmount then
        TriggerClientEvent('phone:client:showNotification', src, {
            title = "Transfer Failed",
            message = "Invalid transfer amount",
            type = "error"
        })
        return
    end
    
    local fee = math.floor(amount * Config.Banking.transactionFee)
    local totalAmount = amount + fee
    
    if RemovePlayerMoney(src, totalAmount) then
        -- Find receiver and add money
        local receiverSource = GetPlayerByPhone(transferData.phoneNumber)
        if receiverSource then
            AddPlayerMoney(receiverSource, amount)
            
            TriggerClientEvent('phone:client:showNotification', src, {
                title = "Transfer Successful",
                message = string.format("Transferred $%d to %s", amount, transferData.phoneNumber),
                type = "success"
            })
            
            TriggerClientEvent('phone:client:showNotification', receiverSource, {
                title = "Money Received",
                message = string.format("Received $%d", amount),
                type = "success"
            })
        else
            -- Refund if receiver not found
            AddPlayerMoney(src, totalAmount)
            TriggerClientEvent('phone:client:showNotification', src, {
                title = "Transfer Failed",
                message = "Recipient not found",
                type = "error"
            })
        end
    else
        TriggerClientEvent('phone:client:showNotification', src, {
            title = "Transfer Failed",
            message = "Insufficient funds",
            type = "error"
        })
    end
    
    TriggerEvent('phone:server:getBankAccount', src)
end)

-- Camera & Screenshots
RegisterNetEvent('phone:server:takePhoto', function()
    local src = source
    
    if Config.Camera.saveLocation then
        -- Integration with screenshot-basic or similar
        TriggerClientEvent('screenshot_basic:requestScreenshotUpload', src, Config.Camera.saveLocation, 'files[]', function(data)
            local photoId = GenerateUniqueId()
            local citizenId = GetPlayerIdentifier(src)
            local user = FetchAll("SELECT * FROM phone_users WHERE citizen_id = ?", {citizenId})[1]
            
            if user and data then
                ExecuteQuery("INSERT INTO phone_photos (id, user_id, url, filename) VALUES (?, ?, ?, ?)", {
                    photoId,
                    user.id,
                    data,
                    "IMG_" .. os.time() .. ".jpg"
                })
                
                TriggerEvent('phone:server:getPhotos', src)
            end
        end)
    end
end)

-- Utility Functions
function GenerateUniqueId()
    return string.sub(tostring(math.random(100000, 999999)) .. tostring(os.time()), 1, 10)
end

function GetPlayerByCitizenId(citizenId)
    if Config.Framework == "qb-core" then
        local players = QBCore.Functions.GetPlayers()
        for _, playerId in pairs(players) do
            local player = QBCore.Functions.GetPlayer(playerId)
            if player.PlayerData.citizenid == citizenId then
                return playerId
            end
        end
    elseif Config.Framework == "esx" then
        local players = ESX.GetPlayers()
        for _, playerId in pairs(players) do
            local player = ESX.GetPlayerFromId(playerId)
            if player.identifier == citizenId then
                return playerId
            end
        end
    end
    return nil
end

function GetPlayerByPhone(phoneNumber)
    if Config.Framework == "qb-core" then
        local players = QBCore.Functions.GetPlayers()
        for _, playerId in pairs(players) do
            local player = QBCore.Functions.GetPlayer(playerId)
            if player.PlayerData.charinfo.phone == phoneNumber then
                return playerId
            end
        end
    elseif Config.Framework == "esx" then
        local players = ESX.GetPlayers()
        for _, playerId in pairs(players) do
            local player = ESX.GetPlayerFromId(playerId)
            if player.phone == phoneNumber then
                return playerId
            end
        end
    end
    return nil
end

-- Player Join/Leave Events
if Config.Framework == "qb-core" then
    RegisterNetEvent('QBCore:Server:PlayerLoaded', function(player)
        TriggerEvent('phone:server:initializeUser', player.PlayerData.source)
    end)
elseif Config.Framework == "esx" then
    RegisterNetEvent('esx:playerLoaded', function(playerId, player)
        TriggerEvent('phone:server:initializeUser', playerId)
    end)
end

-- Item Registration (QBCore)
if Config.Framework == "qb-core" then
    QBCore.Functions.CreateUseableItem(Config.PhoneItem.name, function(source, item)
        TriggerClientEvent('phone:client:use', source)
    end)
end

-- Item Registration (ESX)
if Config.Framework == "esx" then
    ESX.RegisterUsableItem(Config.PhoneItem.name, function(source)
        TriggerClientEvent('phone:use', source)
    end)
end

print("^2[PHONE] Server initialized successfully^0")
