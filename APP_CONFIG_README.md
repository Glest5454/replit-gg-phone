# 📱 Basit Uygulama Ekleme

## 🚀 Yeni Uygulama Ekleme

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

### 3. PNG Icon Kullanma

PNG icon kullanmak için:

```typescript
{
  id: 'instagram',
  name: 'Instagram',
  icon: 'instagram.png', // @apps/ klasöründe olmalı
  iconType: 'png',
  // color kullanmayın (PNG için)
  // ... diğer ayarlar
}
```

## 📋 Gerekli Alanlar

- **id**: Benzersiz uygulama kimliği
- **name**: Görünen isim
- **icon**: Lucide component veya PNG dosya adı
- **iconType**: 'lucide' veya 'png'
- **color**: Sadece Lucide icon için (Tailwind gradient)
- **category**: 'social', 'utilities', 'media', 'productivity', 'system', 'custom'
- **isActive**: Uygulama aktif mi?
- **isVisible**: Ana menüde görünür mü?
- **order**: Sıralama (düşük sayı önce)

## 🎨 Renk Örnekleri

```typescript
// Tek renk
color: 'from-blue-500 to-blue-600'

// Çoklu renk
color: 'from-pink-500 via-purple-500 to-indigo-500'

// Özel renkler
color: 'from-[#ff6b6b] to-[#4ecdc4]'
```

## 📁 Dosya Yapısı

```
src/config/
├── apps.ts              # Ana uygulama listesi
├── simpleAppConfig.ts   # Basit konfigürasyon
└── README.md            # Bu dosya
```

## ⚠️ Önemli Notlar

1. **Uygulama ekledikten sonra sayfayı yenileyin**
2. **Icon type doğru olmalı** (lucide/png)
3. **Color sadece Lucide icon için**
4. **Order düşük sayı önce görünür**
5. **ID benzersiz olmalı**

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
