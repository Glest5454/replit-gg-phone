import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type Language = 'english' | 'turkish';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, section?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Translations {
  [section: string]: {
    [key: string]: {
      english: string;
      turkish: string;
    };
  };
}

const translations: Translations = {
  common: {
    back: { english: 'Back', turkish: 'Geri' },
    settings: { english: 'Settings', turkish: 'Ayarlar' },
    save: { english: 'Save', turkish: 'Kaydet' },
    cancel: { english: 'Cancel', turkish: 'İptal' },
    delete: { english: 'Delete', turkish: 'Sil' },
    edit: { english: 'Edit', turkish: 'Düzenle' },
    add: { english: 'Add', turkish: 'Ekle' },
    search: { english: 'Search', turkish: 'Ara' },
    close: { english: 'Close', turkish: 'Kapat' },
    open: { english: 'Open', turkish: 'Aç' },
    yes: { english: 'Yes', turkish: 'Evet' },
    no: { english: 'No', turkish: 'Hayır' },
    ok: { english: 'OK', turkish: 'Tamam' },
    language: { english: 'Language', turkish: 'Dil' }
  },
  homeScreen: {
    contacts: { english: 'Contacts', turkish: 'Rehber' },
    bank: { english: 'Bank', turkish: 'Banka' },
    camera: { english: 'Camera', turkish: 'Kamera' },
    gallery: { english: 'Gallery', turkish: 'Galeri' },
    messages: { english: 'Messages', turkish: 'Mesajlar' },
    notes: { english: 'Notes', turkish: 'Notlar' },
    calculator: { english: 'Calculator', turkish: 'Hesap Makinesi' },
    weather: { english: 'Weather', turkish: 'Hava Durumu' },
    music: { english: 'Music', turkish: 'Müzik' },
    clock: { english: 'Clock', turkish: 'Saat' },
    maps: { english: 'Maps', turkish: 'Haritalar' },
    twitter: { english: 'Twitter', turkish: 'Twitter' }
  },
  lockScreen: {
    enterPassword: { english: 'Enter Password', turkish: 'Şifre Girin' },
    wrongPassword: { english: 'Wrong Password', turkish: 'Yanlış Şifre' },
    unlockPhone: { english: 'Unlock Phone', turkish: 'Telefonu Aç' },
    swipeToUnlock: { english: 'Swipe to unlock', turkish: 'Açmak için kaydırın' }
  },
  settings: {
    display: { english: 'Display', turkish: 'Ekran' },
    darkMode: { english: 'Dark Mode', turkish: 'Karanlık Mod' },
    brightness: { english: 'Brightness', turkish: 'Parlaklık' },
    language: { english: 'Language', turkish: 'Dil' },
    wallpaper: { english: 'Wallpaper', turkish: 'Duvar Kağıdı' },
    securityPrivacy: { english: 'Security & Privacy', turkish: 'Güvenlik ve Gizlilik' },
    screenLock: { english: 'Screen Lock', turkish: 'Ekran Kilidi' },
    changePIN: { english: 'Change PIN', turkish: 'PIN Değiştir' },
    setPIN: { english: 'Set PIN', turkish: 'PIN Belirle' },
    enterNewPIN: { english: 'Enter new 4-digit PIN', turkish: 'Yeni 4 haneli PIN girin' },
    about: { english: 'About Phone', turkish: 'Telefon Hakkında' },
    version: { english: 'Version', turkish: 'Sürüm' }
  },
  banking: {
    balance: { english: 'Balance', turkish: 'Bakiye' },
    transactions: { english: 'Transactions', turkish: 'İşlemler' },
    deposit: { english: 'Deposit', turkish: 'Para Yatırma' },
    withdrawal: { english: 'Withdrawal', turkish: 'Para Çekme' },
    transfer: { english: 'Transfer', turkish: 'Transfer' },
    accountNumber: { english: 'Account Number', turkish: 'Hesap Numarası' },
    accountHolder: { english: 'Account Holder', turkish: 'Hesap Sahibi' },
    amount: { english: 'Amount', turkish: 'Tutar' },
    description: { english: 'Description', turkish: 'Açıklama' },
    date: { english: 'Date', turkish: 'Tarih' }
  },
  contacts: {
    contacts: { english: 'Contacts', turkish: 'Rehber' },
    addContact: { english: 'Add Contact', turkish: 'Kişi Ekle' },
    editContact: { english: 'Edit Contact', turkish: 'Kişi Düzenle' },
    deleteContact: { english: 'Delete Contact', turkish: 'Kişi Sil' },
    call: { english: 'Call', turkish: 'Ara' },
    message: { english: 'Message', turkish: 'Mesaj' },
    favorites: { english: 'Favorites', turkish: 'Favoriler' },
    all: { english: 'All', turkish: 'Tümü' },
    name: { english: 'Name', turkish: 'İsim' },
    phoneNumber: { english: 'Phone Number', turkish: 'Telefon Numarası' },
    addToFavorites: { english: 'Add to Favorites', turkish: 'Favorilere Ekle' },
    blockContact: { english: 'Block Contact', turkish: 'Kişiyi Engelle' },
    lastCall: { english: 'Last call', turkish: 'Son arama' }
  },
  camera: {
    photo: { english: 'Photo', turkish: 'Fotoğraf' },
    video: { english: 'Video', turkish: 'Video' },
    portrait: { english: 'Portrait', turkish: 'Portre' },
    night: { english: 'Night', turkish: 'Gece' },
    pro: { english: 'Pro', turkish: 'Pro' },
    filters: { english: 'Filters', turkish: 'Filtreler' },
    effects: { english: 'Effects', turkish: 'Efektler' },
    basic: { english: 'Basic', turkish: 'Temel' },
    artistic: { english: 'Artistic', turkish: 'Sanatsal' },
    vintage: { english: 'Vintage', turkish: 'Vintage' },
    beauty: { english: 'Beauty', turkish: 'Güzellik' },
    none: { english: 'None', turkish: 'Yok' },
    vivid: { english: 'Vivid', turkish: 'Canlı' },
    dramatic: { english: 'Dramatic', turkish: 'Dramatik' },
    warm: { english: 'Warm', turkish: 'Sıcak' },
    cool: { english: 'Cool', turkish: 'Soğuk' },
    noir: { english: 'Noir', turkish: 'Noir' },
    retro: { english: 'Retro', turkish: 'Retro' },
    dream: { english: 'Dream', turkish: 'Rüya' },
    glow: { english: 'Glow', turkish: 'Işıltı' },
    soft: { english: 'Soft', turkish: 'Yumuşak' },
    smooth: { english: 'Smooth', turkish: 'Pürüzsüz' },
    grid: { english: 'Grid', turkish: 'Izgara' },
    timer: { english: 'Timer', turkish: 'Zamanlayıcı' },
    hdr: { english: 'HDR', turkish: 'HDR' },
    macro: { english: 'Macro', turkish: 'Makro' },
    iso: { english: 'ISO', turkish: 'ISO' },
    exposure: { english: 'Exposure', turkish: 'Pozlama' },
    auto: { english: 'Auto', turkish: 'Otomatik' }
  },
  notes: {
    notes: { english: 'Notes', turkish: 'Notlar' },
    addNote: { english: 'Add Note', turkish: 'Not Ekle' },
    editNote: { english: 'Edit Note', turkish: 'Not Düzenle' },
    deleteNote: { english: 'Delete Note', turkish: 'Not Sil' },
    title: { english: 'Title', turkish: 'Başlık' },
    content: { english: 'Content', turkish: 'İçerik' },
    updated: { english: 'Updated', turkish: 'Güncellendi' },
    created: { english: 'Created', turkish: 'Oluşturuldu' },
    startWriting: { english: 'Start writing...', turkish: 'Yazmaya başlayın...' }
  },
  calculator: {
    calculator: { english: 'Calculator', turkish: 'Hesap Makinesi' },
    clear: { english: 'Clear', turkish: 'Temizle' },
    equals: { english: 'Equals', turkish: 'Eşittir' }
  },
  gallery: {
    gallery: { english: 'Gallery', turkish: 'Galeri' },
    photos: { english: 'Photos', turkish: 'Fotoğraflar' },
    albums: { english: 'Albums', turkish: 'Albümler' },
    share: { english: 'Share', turkish: 'Paylaş' },
    filename: { english: 'Filename', turkish: 'Dosya Adı' },
    selectAll: { english: 'Select All', turkish: 'Tümünü Seç' }
  },
  weather: {
    weather: { english: 'Weather', turkish: 'Hava Durumu' },
    today: { english: 'Today', turkish: 'Bugün' },
    forecast: { english: 'Forecast', turkish: 'Tahmin' },
    temperature: { english: 'Temperature', turkish: 'Sıcaklık' },
    humidity: { english: 'Humidity', turkish: 'Nem' },
    wind: { english: 'Wind', turkish: 'Rüzgar' },
    pressure: { english: 'Pressure', turkish: 'Basınç' },
    visibility: { english: 'Visibility', turkish: 'Görüş' },
    sunrise: { english: 'Sunrise', turkish: 'Gündoğumu' },
    sunset: { english: 'Sunset', turkish: 'Günbatımı' }
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('phone-language');
    return (saved as Language) || 'english';
  });

  useEffect(() => {
    localStorage.setItem('phone-language', language);
    document.documentElement.setAttribute('data-language', language);
  }, [language]);

  const t = (key: string, section: string = 'common'): string => {
    const translation = translations[section]?.[key];
    if (!translation) {
      console.warn(`Translation missing for ${section}.${key}`);
      return key;
    }
    return translation[language] || translation.english || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};