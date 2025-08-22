# FiveM Metadata Sistemi ile localStorage Değişimi

Bu dokümanda, telefon script'inde localStorage kullanımını FiveM'in kendi metadata sistemi ile nasıl değiştirdiğimizi açıklıyoruz.

## Neden Metadata Sistemi?

### localStorage'ın Dezavantajları:
- **Güvenlik**: Client-side'da saklanan veriler manipüle edilebilir
- **Kalıcılık**: Oyuncu tarayıcı verilerini temizlediğinde kaybolur
- **Senkronizasyon**: Farklı cihazlarda senkronize olmaz
- **Sunucu Kontrolü**: Sunucu tarafından kontrol edilemez

### FiveM Metadata Sistemi'nin Avantajları:
- **Güvenlik**: Sunucu tarafında saklanır, manipüle edilemez
- **Kalıcılık**: Veritabanında saklanır, oyuncu çıkış yapsa bile korunur
- **Senkronizasyon**: Tüm cihazlarda senkronize olur
- **Sunucu Kontrolü**: Sunucu tarafından tam kontrol
- **Performans**: Daha hızlı erişim ve daha az network trafiği

## Yapılan Değişiklikler

### 1. Server.lua
- Metadata yönetimi için yardımcı fonksiyonlar eklendi
- Phone settings, app states, theme, wallpaper, brightness, language, lock settings için metadata event'leri eklendi
- Eski database tabloları yerine metadata kullanımı

### 2. Client.lua
- Metadata event handler'ları eklendi
- Phone settings, app states, theme, wallpaper, brightness, language, lock settings için client event'leri

### 3. React Hook'ları
- `useTheme.tsx`: localStorage yerine metadata kullanımı
- `usePhone.tsx`: localStorage yerine metadata kullanımı
- `useLanguage.tsx`: localStorage yerine metadata kullanımı

## Metadata Anahtarları

Aşağıdaki metadata anahtarları kullanılmaktadır:

```lua
-- Phone Settings
'phone_settings'           -- Genel telefon ayarları
'phone_theme'             -- Tema (light/dark)
'phone_wallpaper'         -- Duvar kağıdı
'phone_brightness'        -- Parlaklık
'phone_language'          -- Dil
'phone_lock_settings'     -- Kilit ayarları
'phone_app_order'         -- Uygulama sırası
'phone_user_id'           -- Kullanıcı ID'si
'phone_app_states'        -- Uygulama durumları
```

## Kullanım Örneği

### Server Side:
```lua
-- Metadata kaydetme
SetPlayerMetadataByCitizenId(citizenId, 'phone_theme', 'dark')

-- Metadata okuma
local theme = GetPlayerMetadataByCitizenId(citizenId, 'phone_theme')
```

### Client Side:
```typescript
// Metadata kaydetme
NUIManager.post('savePhoneTheme', { theme: 'dark' });

// Metadata okuma
NUIManager.post('getPhoneTheme', {});
```

## Event Sistemi

### Server Events:
- `gg-phone:server:savePhoneSettings`
- `gg-phone:server:getPhoneSettings`
- `gg-phone:server:savePhoneTheme`
- `gg-phone:server:savePhoneWallpaper`
- `gg-phone:server:savePhoneBrightness`
- `gg-phone:server:savePhoneLanguage`
- `gg-phone:server:savePhoneLockSettings`
- `gg-phone:server:getPhoneLockSettings`
- `gg-phone:server:savePhoneAppOrder`
- `gg-phone:server:getPhoneAppOrder`
- `gg-phone:server:savePhoneUserId`
- `gg-phone:server:getPhoneUserId`
- `gg-phone:server:saveAppStates`
- `gg-phone:server:getAppStates`

### Client Events:
- `gg-phone:client:phoneSettingsSaved`
- `gg-phone:client:phoneSettingsError`
- `gg-phone:client:phoneSettingsLoaded`
- `gg-phone:client:phoneThemeSaved`
- `gg-phone:client:phoneWallpaperSaved`
- `gg-phone:client:phoneBrightnessSaved`
- `gg-phone:client:phoneLanguageSaved`
- `gg-phone:client:phoneLockSettingsSaved`
- `gg-phone:client:phoneLockSettingsLoaded`
- `gg-phone:client:phoneAppOrderSaved`
- `gg-phone:client:phoneAppOrderLoaded`
- `gg-phone:client:phoneUserIdSaved`
- `gg-phone:client:phoneUserIdLoaded`
- `gg-phone:client:appStatesSaved`
- `gg-phone:client:appStatesError`
- `gg-phone:client:appStatesLoaded`

## Geçiş Süreci

### 1. Aşama: Metadata Sistemi Kurulumu
- Server.lua'ya metadata fonksiyonları eklendi
- Client.lua'ya event handler'lar eklendi

### 2. Aşama: Hook Güncellemeleri
- React hook'ları metadata kullanacak şekilde güncellendi
- localStorage kullanımları kaldırıldı

### 3. Aşama: Test ve Doğrulama
- Metadata sistemi test edildi
- Veri kaybı olmadığı doğrulandı

## Performans İyileştirmeleri

### Öncesi (localStorage):
- Her değişiklikte localStorage'a yazma
- Client-side veri yönetimi
- Güvenlik riskleri

### Sonrası (Metadata):
- Batch metadata güncellemeleri
- Server-side veri yönetimi
- Güvenli veri saklama

## Güvenlik

### localStorage Güvenlik Riskleri:
- Client-side manipulation
- XSS saldırıları
- Veri sızıntısı

### Metadata Güvenlik Avantajları:
- Server-side validation
- Anti-cheat koruması
- Güvenli veri saklama

## Sonuç

localStorage'dan FiveM metadata sistemine geçiş ile:

✅ **Güvenlik** artırıldı
✅ **Performans** iyileştirildi  
✅ **Veri kalıcılığı** sağlandı
✅ **Senkronizasyon** iyileştirildi
✅ **Sunucu kontrolü** artırıldı

Bu değişiklik ile telefon script'i daha güvenli, performanslı ve FiveM ekosistemi ile uyumlu hale geldi.
