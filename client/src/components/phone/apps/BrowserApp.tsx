import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, RefreshCw, Home, BookOpen, Share2, MoreVertical } from "lucide-react";
import { useNotificationContext } from "@/context/NotificationContext";

interface BrowserAppProps {
  onBack: () => void;
}

export const BrowserApp = ({ onBack }: BrowserAppProps) => {
  const [url, setUrl] = useState("https://www.google.com");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
        setUrl(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
        setIsLoading(false);
      
      }, 1000);
    }
  };

  const handleUrlSubmit = () => {
    if (url.trim()) {
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
       
      }, 1000);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    
    }, 800);
  };

  const handleHome = () => {
    setUrl("https://www.google.com");
    setSearchQuery("");
    setCurrentPage("home");
  };

  const handleBookmarks = () => {
    setCurrentPage("bookmarks");
  };

  const handleShare = () => {
    
  };

  const bookmarks = [
    { name: "Google", url: "https://www.google.com", icon: "🔍" },
    { name: "YouTube", url: "https://www.youtube.com", icon: "📺" },
    { name: "GitHub", url: "https://github.com", icon: "💻" },
    { name: "Stack Overflow", url: "https://stackoverflow.com", icon: "❓" },
  ];

  if (currentPage === "bookmarks") {
    return (
      <div className="h-full bg-surface-dark text-white flex flex-col">
        {/* Header */}
        <div className="bg-surface-dark/50 p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setCurrentPage("home")}
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-white">Bookmarks</h1>
                <p className="text-sm text-white/60">Saved websites</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {bookmarks.map((bookmark, index) => (
              <Card
                key={index}
                className="bg-surface-dark/30 border-white/10 hover:bg-surface-dark/50 cursor-pointer transition-colors p-4 backdrop-blur-sm"
                onClick={() => {
                  setUrl(bookmark.url);
                  setCurrentPage("home");
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-samsung-blue rounded-2xl flex items-center justify-center text-white text-lg">
                    {bookmark.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{bookmark.name}</h3>
                    <p className="text-sm text-white/60 truncate">{bookmark.url}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-surface-dark text-white flex flex-col">
      {/* Header */}
      <div className="bg-surface-dark/50 p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-white">Browser</h1>
              <p className="text-sm text-white/60">Web browsing</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleBookmarks}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* URL Bar */}
        <div className="flex items-center space-x-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL or search..."
            className="bg-surface-dark/50 border-white/20 text-black placeholder-white/60 focus:border-samsung-blue rounded-samsung-sm flex-1"
            onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
          />
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the web..."
              className="bg-surface-dark/50 text-black placeholder-white/60 pl-10 border-white/20 focus:border-samsung-blue rounded-samsung-sm"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            className="bg-samsung-blue hover:bg-samsung-blue/80 text-white rounded-samsung-sm px-4"
            disabled={isLoading}
          >
            Search
          </Button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 border-4 border-samsung-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white/60">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-surface-dark/30 border-white/10 p-4 backdrop-blur-sm cursor-pointer hover:bg-surface-dark/50 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-samsung-blue rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-white font-medium">Search</p>
                </div>
              </Card>
              <Card className="bg-surface-dark/30 border-white/10 p-4 backdrop-blur-sm cursor-pointer hover:bg-surface-dark/50 transition-colors">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-white font-medium">Bookmarks</p>
                </div>
              </Card>
            </div>

            {/* Current Page Info */}
            <Card className="bg-surface-dark/30 border-white/10 p-4 backdrop-blur-sm">
              <div className="space-y-2">
                <h3 className="font-semibold text-white">Current Page</h3>
                <p className="text-sm text-white/60 break-all">{url}</p>
                <div className="flex items-center space-x-2 text-xs text-white/40">
                  <span>🔒 Secure connection</span>
                  <span>•</span>
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </Card>

            {/* Recent Searches */}
            <div>
              <h3 className="font-semibold text-white mb-3">Recent Searches</h3>
              <div className="space-y-2">
                {["React development", "Samsung S25", "Web design trends", "Mobile apps"].map((search, index) => (
                  <div
                    key={index}
                    className="bg-surface-dark/20 rounded-lg p-3 cursor-pointer hover:bg-surface-dark/30 transition-colors"
                    onClick={() => setSearchQuery(search)}
                  >
                    <p className="text-white text-sm">{search}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-surface-dark/50 p-3 border-t border-white/10">
        <div className="flex items-center justify-around">
          <Button
            onClick={handleHome}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleBookmarks}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
