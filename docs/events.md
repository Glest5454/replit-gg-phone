# Phone Script Events Documentation

This document outlines all the available events for the Samsung Galaxy S25 Phone Script.

## Client Events (Triggerable from server)

### phone:client:updateContacts
Updates the contacts list in the phone UI.
```lua
TriggerClientEvent('phone:client:updateContacts', source, contacts)
