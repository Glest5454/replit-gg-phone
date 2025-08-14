import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, Trash2, Star, Users, Package, ArrowLeft, Filter, Grid3X3, List, Bug } from 'lucide-react';
import { appsConfig, AppConfig, getAppsWithInstallStatus, getAppManager } from '@/config/apps';
import { useLanguage } from '@/hooks/useLanguage';

export const AppsApp = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'downloads' | 'size'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [apps, setApps] = useState<AppConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load apps with installation status
  useEffect(() => {
    const loadApps = async () => {
      try {
        setIsLoading(true);
        const appsWithStatus = getAppsWithInstallStatus();
        setApps(appsWithStatus);
      } catch (error) {
        console.error('Error loading apps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadApps();
  }, []);

  // Categories for filtering
  const categories = [
    { id: 'all', name: t('all', 'apps'), icon: Package, color: 'from-blue-500 to-purple-500' },
    { id: 'social', name: t('social', 'apps'), icon: Users, color: 'from-green-500 to-teal-500' },
    { id: 'utilities', name: t('utilities', 'apps'), icon: Package, color: 'from-orange-500 to-red-500' },
    { id: 'media', name: t('media', 'apps'), icon: Package, color: 'from-pink-500 to-rose-500' },
    { id: 'productivity', name: t('productivity', 'apps'), icon: Package, color: 'from-indigo-500 to-blue-500' },
    { id: 'system', name: t('system', 'apps'), icon: Package, color: 'from-gray-500 to-slate-500' },
  ];

  // Filter and sort apps
  const filteredApps = useMemo(() => {
    let filtered = apps.filter((app: AppConfig) => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           app.developer?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort apps
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'downloads':
          return (b.downloads || 0) - (a.downloads || 0);
        case 'size':
          return parseFloat(b.appSize?.replace(' MB', '') || '0') - parseFloat(a.appSize?.replace(' MB', '') || '0');
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [apps, searchQuery, selectedCategory, sortBy]);

  // Handle app installation
  const handleInstall = async (app: AppConfig) => {
    
    const appManager = getAppManager();
    
    if (app.isInstalled) {
      // Uninstall app
    
      if (app.isEssential) {
       
        alert('This app is essential and cannot be uninstalled');
        return;
      }
      
      const confirmMessage = `Are you sure you want to uninstall "${app.name}"?`;
    
      
      if (confirm(confirmMessage)) {
      
        const success = await appManager.uninstallApp(app.id);
      
        if (success) {
          // Reload apps to update UI
          const updatedApps = getAppsWithInstallStatus();
          setApps(updatedApps);
          
          // Notify HomeScreen to refresh app list
          const event = new CustomEvent('phone:appStateChanged', {
            detail: { action: 'uninstalled', appId: app.id }
          });
          window.dispatchEvent(event);
          console.log('App uninstalled successfully, UI updated. Event dispatched:', event);
          
          // Also force a localStorage sync check
          setTimeout(() => {
            const appManager = getAppManager();
            console.log('Current installed apps after uninstall:', appManager.getInstalledApps());
          }, 100);
        } else {
          console.error('Failed to uninstall app:', app.id);
        }
      } else {
       
      }
    } else {
      // Install app
      
      const success = await appManager.installApp(app.id);
      console.log('Install result:', success);
      
      if (success) {
        // Reload apps to update UI
        const updatedApps = getAppsWithInstallStatus();
        setApps(updatedApps);
        
        // Notify HomeScreen to refresh app list
        const event = new CustomEvent('phone:appStateChanged', {
          detail: { action: 'installed', appId: app.id }
        });
        window.dispatchEvent(event);
        console.log('App installed successfully, UI updated. Event dispatched:', event);
        
        // Also force a localStorage sync check
        setTimeout(() => {
          const appManager = getAppManager();
          console.log('Current installed apps after install:', appManager.getInstalledApps());
        }, 100);
      } else {
        console.error('Failed to install app:', app.id);
      }
    }
  };

  // Format app size
  const formatAppSize = (size?: string) => {
    return size || 'Unknown';
  };

  // Format downloads count
  const formatDownloads = (downloads?: number) => {
    if (!downloads) return '0';
    if (downloads >= 1000000) return `${(downloads / 1000000).toFixed(1)}M`;
    if (downloads >= 1000) return `${(downloads / 1000).toFixed(1)}K`;
    return downloads.toString();
  };

  // Render star rating
  const renderRating = (rating?: number) => {
    if (!rating) return <span className="text-gray-400 text-sm">N/A</span>;
    
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-300 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
                             <h1 className="text-xl font-bold">App Store</h1>
              <p className="text-xs text-gray-400">Discover amazing apps</p>
            </div>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-black/20 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
         
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
          />
        </div>
       
      </div>

      {/* Category Filter */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex space-x-2 overflow-y-auto pb-2 ">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                  : 'bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sort and Filter Bar */}
      <div className="px-4 py-3 border-b border-white/10 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-400">{t('sortBy', 'apps')}:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            >
              <option value="name">{t('name', 'apps')}</option>
              <option value="rating">{t('rating', 'apps')}</option>
              <option value="downloads">{t('downloads', 'apps')}</option>
              <option value="size">{t('size', 'apps')}</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? 'bg-purple-500/20 text-purple-400' : 'bg-black/30 text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Apps List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
        {viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-2 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-purple-500/50 transition-all duration-200 hover:scale-105 group"
              >
                {/* App Icon */}
                <div className="flex justify-center mb-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    app.iconType === 'png' ? 'bg-black/20' : `bg-gradient-to-br ${app.color}`
                  }`}>
                    {app.iconType === 'png' ? (
                      <img src={app.icon as string} alt={app.name} className="w-12 h-12 object-contain" />
                    ) : (
                      <app.icon className="w-10 h-10 text-white" />
                    )}
                  </div>
                </div>

                {/* App Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-sm text-white mb-1 truncate">{app.name}</h3>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{app.description}</p>
                  
                  {/* Rating */}
                  <div className="flex justify-center mb-2">
                    {renderRating(app.rating)}
                  </div>
                  
                  {/* App Details */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>{app.developer || 'Unknown'}</div>
                    <div>{formatAppSize(app.appSize)} • {formatDownloads(app.downloads)}</div>
                  </div>
                </div>

                {/* Install Button */}
                                 <button
                   onClick={() => handleInstall(app)}
                   className={`w-full mt-3 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                     app.isInstalled
                       ? app.isEssential
                         ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                         : 'bg-red-600 hover:bg-red-700 text-white hover:scale-105'
                       : app.isEssential
                         ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                         : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105 shadow-lg'
                   }`}
                   disabled={app.isEssential}
                 >
                                     {app.isInstalled ? (
                     <div className="flex items-center justify-center space-x-2">
                       <Trash2 className="w-4 h-4" />
                       <span>{app.isEssential ? 'Essential' : 'Uninstall'}</span>
                     </div>
                   ) : (
                     <div className="flex items-center justify-center space-x-2">
                       <Download className="w-4 h-4" />
                       <span>Install</span>
                     </div>
                   )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-purple-500/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  {/* App Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      app.iconType === 'png' ? 'bg-black/20' : `bg-gradient-to-br ${app.color}`
                    }`}>
                      {app.iconType === 'png' ? (
                        <img src={app.icon as string} alt={app.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <app.icon className="w-10 h-10 text-white" />
                      )}
                    </div>
                  </div>

                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white mb-1">{app.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{app.description}</p>
                        
                        {/* App Details */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{app.developer || 'Unknown Developer'}</span>
                          <span>•</span>
                          <span>{formatAppSize(app.appSize)}</span>
                          <span>•</span>
                          <span>{app.version || '1.0.0'}</span>
                        </div>

                        {/* Rating and Downloads */}
                        <div className="flex items-center space-x-4 mt-2">
                          {renderRating(app.rating)}
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">{formatDownloads(app.downloads)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Install Button */}
                                             <button
                         onClick={() => handleInstall(app)}
                         className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                           app.isInstalled
                             ? app.isEssential
                               ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                               : 'bg-red-600 hover:bg-red-700 text-white'
                             : app.isEssential
                               ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                               : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                         }`}
                         disabled={app.isEssential}
                       >
                        {app.isInstalled ? (
                          <div className="flex items-center space-x-2">
                            <Trash2 className="w-4 h-4" />
                            <span>{app.isEssential ? 'Essential' : 'Uninstall'}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>Install</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredApps.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No apps found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* App Count */}
      <div className="px-4 py-3 border-t border-white/10 bg-black/20 text-center">
        <p className="text-sm text-gray-400">
          Showing {filteredApps.length} of {apps.length} apps
        </p>
      </div>
    </div>
  );
};
