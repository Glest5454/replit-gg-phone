# 📱 Yeni Uygulama Ekleme Rehberi

## 🚀 Hızlı Ekleme

### 1. apps.ts Dosyasına Uygulama Ekleme

`client/src/config/apps.ts` dosyasını açın ve `appsConfig` array'ine yeni uygulama ekleyin:

```typescript
{
  id: 'instagram',
  name: 'Instagram',
  icon: Instagram, // Lucide icon import edin
  iconType: 'lucide',
  color: 'from-pink-500 to-purple-500',
  category: 'social',
  isActive: true,
  isVisible: true,
  order: 12,
  screen: 'instagram', // Navigation için gerekli
  description: 'Instagram social media app',
  version: '1.0.0',
  permissions: ['social'],
  settings: {
    hasSettings: true,
    settingsPath: '/instagram/settings',
  },
  notifications: {
    enabled: true,
    types: ['info', 'success'],
  },
},
```

### 2. Icon Import Etme

Dosyanın üstüne icon'u import edin:

```typescript
import { Instagram } from 'lucide-react';
```

### 3. Çeviri Ekleme

`getTranslatedApps` fonksiyonuna çeviri ekleyin:

```typescript
tr: {
  // ... mevcut çeviriler
  'instagram': 'Instagram',
},
en: {
  // ... mevcut çeviriler
  'instagram': 'Instagram',
}
```

## 📋 Gerekli Alanlar

- **id**: Benzersiz uygulama kimliği
- **name**: İngilizce isim
- **icon**: Lucide component veya PNG dosya adı
- **iconType**: 'lucide' veya 'png'
- **color**: Sadece Lucide icon için (Tailwind gradient)
- **category**: 'social', 'utilities', 'media', 'productivity', 'system', 'custom'
- **isActive**: Uygulama aktif mi? (true)
- **isVisible**: Ana menüde görünür mü? (true)
- **order**: Sıralama (düşük sayı önce)
- **screen**: Navigation screen (genellikle id ile aynı)

## 🎨 Renk Örnekleri

```typescript
// Tek renk
color: 'from-blue-500 to-blue-600'

// Çoklu renk
color: 'from-pink-500 via-purple-500 to-indigo-500'

// Özel renkler
color: 'from-[#ff6b6b] to-[#4ecdc4]'
```

## ⚠️ Önemli Notlar

1. **Uygulama ekledikten sonra sayfayı yenileyin**
2. **Icon type doğru olmalı** (lucide/png)
3. **Color sadece Lucide icon için**
4. **Order düşük sayı önce görünür**
5. **ID benzersiz olmalı**
6. **Screen property eklenmeli** (navigation için)

## 🔧 Mevcut Fonksiyonlar

```typescript
import { addNewApp, updateApp, removeApp } from './config/apps';

// Uygulama ekle
addNewApp(newApp);

// Uygulama güncelle
updateApp('app-id', { name: 'Yeni İsim' });

// Uygulama kaldır
removeApp('app-id');
```

---

**🎉 Artık yeni uygulamaları kolayca ekleyebilirsiniz!**
