import { ArrowLeft, Search, MapPin, Phone, Star, Globe, Filter } from 'lucide-react';
import { useState } from 'react';

interface YellowPagesAppProps {
  onBack: () => void;
}

interface Business {
  id: string;
  name: string;
  category: string;
  phoneNumber: string;
  address: string;
  description: string;
  website?: string;
  rating: number;
  verified: boolean;
}

const categories = [
  'All', 'Restaurants', 'Automotive', 'Shopping', 'Services', 
  'Healthcare', 'Entertainment', 'Real Estate', 'Legal'
];

export const YellowPagesApp = ({ onBack }: YellowPagesAppProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // This would be replaced with actual API calls in FiveM
  const searchBusinesses = async () => {
    setIsLoading(true);
    // API call would go here: TriggerServerEvent('phone:yellowpages:search', searchQuery, selectedCategory)
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const callBusiness = (phoneNumber: string) => {
    // This would trigger the phone call in FiveM
    console.log('Calling business:', phoneNumber);
    // TriggerServerEvent('phone:call:start', phoneNumber)
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-white/30'}`} 
      />
    ));
  };

  return (
    <div className="absolute inset-0 bg-oneui-dark flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="yellowpages-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-lg font-semibold">Yellow Pages</h1>
        <button 
          className="oneui-button p-2"
          data-testid="yellowpages-filter"
        >
          <Filter className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchBusinesses()}
            className="w-full bg-surface-dark/50 text-white placeholder-white/60 pl-10 pr-4 py-3 rounded-samsung-sm border border-white/10 outline-none focus:border-samsung-blue"
            data-testid="search-input"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-2 border-b border-white/10">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              className={`oneui-button px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-samsung-blue text-white'
                  : 'bg-surface-dark/50 text-white/70 hover:bg-surface-dark/70'
              }`}
              onClick={() => setSelectedCategory(category)}
              data-testid={`category-${category.toLowerCase()}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white/60 text-center">
              <div className="w-8 h-8 border-2 border-samsung-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>Searching businesses...</p>
            </div>
          </div>
        ) : businesses.length > 0 ? (
          <div className="p-4 space-y-4">
            {businesses.map((business) => (
              <div 
                key={business.id}
                className="bg-surface-dark/30 rounded-samsung-sm p-4 border border-white/10"
                data-testid={`business-${business.id}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-white font-semibold text-lg">{business.name}</h3>
                      {business.verified && (
                        <div className="w-5 h-5 bg-samsung-blue rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-samsung-blue text-sm font-medium mb-1">{business.category}</p>
                    <div className="flex items-center space-x-1 mb-2">
                      {renderStars(business.rating)}
                      <span className="text-white/60 text-sm ml-2">({business.rating}.0)</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 text-sm mb-3">{business.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-white/70 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{business.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/70 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{business.phoneNumber}</span>
                  </div>
                  {business.website && (
                    <div className="flex items-center space-x-2 text-white/70 text-sm">
                      <Globe className="w-4 h-4" />
                      <span>{business.website}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    className="oneui-button flex-1 bg-samsung-blue text-white py-2 px-4 rounded-samsung-sm font-medium"
                    onClick={() => callBusiness(business.phoneNumber)}
                    data-testid={`call-${business.id}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </button>
                  <button 
                    className="oneui-button bg-surface-dark/50 text-white py-2 px-4 rounded-samsung-sm font-medium"
                    data-testid={`directions-${business.id}`}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="w-16 h-16 bg-surface-dark/50 rounded-samsung mx-auto mb-4 flex items-center justify-center">
                📕
              </div>
              <h3 className="text-lg font-medium mb-2">No Results Found</h3>
              <p className="text-sm">Try searching for businesses in your area</p>
              <button 
                className="oneui-button bg-samsung-blue text-white px-6 py-2 rounded-samsung-sm font-medium mt-4"
                onClick={searchBusinesses}
                data-testid="search-businesses"
              >
                Search Businesses
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
