// Basit Uygulama Konfigürasyonu
// Yeni uygulama eklemek için bu dosyayı düzenleyin

export interface SimpleAppConfig {
  id: string;
  name: string;
  icon: string | React.ComponentType<any>;
  iconType: 'png' | 'lucide';
  color?: string;
  isVisible: boolean;
  order: number;
}

// Yeni uygulama eklemek için bu fonksiyonu kullanın
export const addNewApp = (newApp: SimpleAppConfig) => {
  // Bu fonksiyon apps.ts dosyasına uygulama ekler
  console.log('Yeni uygulama eklendi:', newApp.name);
  
  // Gerçek implementasyon için apps.ts dosyasındaki addNewApp fonksiyonunu kullanın
  // import { addNewApp } from './apps';
  // addNewApp(newApp);
};

// Örnek kullanım:
/*
import { Instagram } from 'lucide-react';

const newApp = {
  id: 'instagram',
  name: 'Instagram',
  icon: Instagram,
  iconType: 'lucide',
  color: 'from-pink-500 to-purple-500',
  isVisible: true,
  order: 12
};

addNewApp(newApp);
*/
