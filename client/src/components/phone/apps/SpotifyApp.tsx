import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  MoreHorizontal,
  Shuffle,
  Repeat,
  Search,
  Home,
  Library,
  Volume2,
  VolumeX,
  List,
  Clock,
  User,
  Plus,
  Download,
  Share2,
  Mic,
  MicOff
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface SpotifyAppProps {
  onBack: () => void;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  coverUrl: string;
  isLiked: boolean;
  isDownloaded: boolean;
}

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
  tracks: Track[];
}

export const SpotifyApp = ({ onBack }: SpotifyAppProps) => {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'library' | 'playlist'>('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(87);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  // Mock data
  const playlists: Playlist[] = [
    {
      id: "1",
      name: "Liked Songs",
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      trackCount: 127,
      tracks: [
        {
          id: "1",
          title: "Midnight City",
          artist: "M83",
          album: "Hurry Up, We're Dreaming",
          duration: 244,
          coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          isLiked: true,
          isDownloaded: false
        },
        {
          id: "2",
          title: "Blinding Lights",
          artist: "The Weeknd",
          album: "After Hours",
          duration: 200,
          coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          isLiked: true,
          isDownloaded: true
        },
        {
          id: "3",
          title: "Shape of You",
          artist: "Ed Sheeran",
          album: "÷ (Divide)",
          duration: 233,
          coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
          isLiked: false,
          isDownloaded: false
        }
      ]
    },
    {
      id: "2",
      name: "Chill Vibes",
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      trackCount: 45,
      tracks: []
    },
    {
      id: "3",
      name: "Workout Mix",
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      trackCount: 32,
      tracks: []
    }
  ];

  const currentTrack = playlists[0].tracks[currentTrackIndex];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (currentTime / currentTrack.duration) * 100;

  // Audio progress simulation
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, currentTrack.duration]);

  // pma-voice integration
  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (isVoiceEnabled) {
      // Disable voice
      fetch('https://nui-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'disableVoice',
          app: 'spotify'
        })
      });
    } else {
      // Enable voice
      fetch('https://nui-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'enableVoice',
          app: 'spotify',
          volume: volume,
          track: currentTrack.title,
          artist: currentTrack.artist
        })
      });
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (isVoiceEnabled) {
      // Update voice status
      fetch('https://nui-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'updateVoiceStatus',
          app: 'spotify',
          isPlaying: !isPlaying,
          track: currentTrack.title,
          artist: currentTrack.artist
        })
      });
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % playlists[0].tracks.length;
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    
    if (isVoiceEnabled) {
      // Update voice track
      const nextTrack = playlists[0].tracks[nextIndex];
      fetch('https://nui-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'updateVoiceTrack',
          app: 'spotify',
          track: nextTrack.title,
          artist: nextTrack.artist
        })
      });
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? playlists[0].tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    
    if (isVoiceEnabled) {
      // Update voice track
      const prevTrack = playlists[0].tracks[prevIndex];
      fetch('https://nui-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'updateVoiceTrack',
          app: 'spotify',
          track: prevTrack.title,
          artist: prevTrack.artist
        })
      });
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (isVoiceEnabled) {
      // Update voice volume
      fetch('https://nui-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'updateVoiceVolume',
          app: 'spotify',
          volume: newVolume
        })
      });
    }
  };

  const handleTrackSelect = (track: Track, index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    
    if (isVoiceEnabled) {
      // Update voice track
      fetch('https://nui-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'updateVoiceTrack',
          app: 'spotify',
          track: track.title,
          artist: track.artist
        })
      });
    }
  };

  const handlePlaylistSelect = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentView('playlist');
  };

  // Home View
  if (currentView === 'home') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-green-900 via-black to-black flex flex-col">
        {/* App Header */}
        <div className="bg-black/20 backdrop-blur-sm p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-white text-xl font-bold">Spotify</h1>
              <p className="text-white/60 text-sm">Music for everyone</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Voice Control */}
          <Card className="bg-green-600/20 border-green-500/30 p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold mb-1">Voice Integration</h3>
                <p className="text-white/80 text-sm">Share music with other players</p>
              </div>
              <Button
                onClick={toggleVoice}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isVoiceEnabled 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {isVoiceEnabled ? (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Enabled
                  </>
                ) : (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Enable
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Recently Played */}
          <div className="mb-6">
            <h2 className="text-white text-lg font-semibold mb-4">Recently Played</h2>
            <div className="space-y-3">
              {playlists[0].tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => handleTrackSelect(track, index)}
                >
                  <div className="flex items-center space-x-3">
                    <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">{track.title}</h3>
                      <p className="text-white/60 text-xs">{track.artist}</p>
                    </div>
                    <div className="text-white/40 text-xs">{formatTime(track.duration)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Playlists */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Your Playlists</h2>
            <div className="grid grid-cols-2 gap-3">
              {playlists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors border-white/20"
                  onClick={() => handlePlaylistSelect(playlist)}
                >
                  <div className="p-3">
                    <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-24 rounded-xl object-cover mb-2" />
                    <h3 className="text-white font-medium text-sm">{playlist.name}</h3>
                    <p className="text-white/60 text-xs">{playlist.trackCount} songs</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="flex items-center justify-around py-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-400 bg-green-500/20 rounded-2xl p-3"
              onClick={() => setCurrentView('home')}
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white rounded-2xl p-3"
              onClick={() => setCurrentView('search')}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white rounded-2xl p-3"
              onClick={() => setCurrentView('library')}
            >
              <Library className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Search View
  if (currentView === 'search') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-green-900 via-black to-black flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setCurrentView('home')}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-white text-xl font-bold">Search</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="bg-white/10 border-white/20 text-white placeholder-white/60 pl-10 rounded-2xl"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Search for music</h3>
            <p className="text-white/60">Find your favorite songs and artists</p>
          </div>
        </div>
      </div>
    );
  }

  // Library View
  if (currentView === 'library') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-green-900 via-black to-black flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setCurrentView('home')}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-white text-xl font-bold">Your Library</h1>
          </div>
        </div>

        {/* Library Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors border-white/20"
                onClick={() => handlePlaylistSelect(playlist)}
              >
                <div className="flex items-center space-x-3 p-3">
                  <img src={playlist.coverUrl} alt={playlist.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{playlist.name}</h3>
                    <p className="text-white/60 text-sm">{playlist.trackCount} songs</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/60 hover:text-white"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Playlist View
  if (currentView === 'playlist' && currentPlaylist) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-green-900 via-black to-black flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setCurrentView('home')}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-white text-lg font-semibold">{currentPlaylist.name}</h1>
              <p className="text-white/60 text-sm">{currentPlaylist.trackCount} songs</p>
            </div>
          </div>
        </div>

        {/* Playlist Tracks */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {currentPlaylist.tracks.length > 0 ? (
              currentPlaylist.tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 cursor-pointer hover:bg-white/20 transition-colors"
                  onClick={() => handleTrackSelect(track, index)}
                >
                  <div className="flex items-center space-x-3">
                    <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h3 className="text-white font-medium text-sm">{track.title}</h3>
                      <p className="text-white/60 text-xs">{track.artist}</p>
                    </div>
                    <div className="text-white/40 text-xs">{formatTime(track.duration)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <List className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">Empty Playlist</h3>
                <p className="text-white/60">Add some songs to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Player View
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-green-900 via-black to-black flex flex-col">
      {/* App Header */}
      <div className="bg-black/20 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setCurrentView('home')}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <p className="text-white/60 text-sm">Playing from</p>
            <p className="text-white font-medium">Your Library</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-80 h-80 rounded-3xl shadow-2xl overflow-hidden">
          <img
            src={currentTrack.coverUrl}
            alt={`${currentTrack.album} cover`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Track Info */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h2 className="text-white text-2xl font-bold mb-1">
              {currentTrack.title}
            </h2>
            <p className="text-white/70 text-lg">{currentTrack.artist}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${currentTrack.isLiked ? "text-green-400" : "text-white/60"}`}
            onClick={() => {
              // Toggle like
              const updatedTracks = [...playlists[0].tracks];
              updatedTracks[currentTrackIndex].isLiked = !updatedTracks[currentTrackIndex].isLiked;
            }}
          >
            <Heart className={`w-6 h-6 ${currentTrack.isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-white/20 rounded-full h-1 mb-2">
            <div
              className="bg-green-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-white/60 text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${isShuffled ? "text-green-500" : "text-white/60"}`}
            onClick={() => setIsShuffled(!isShuffled)}
          >
            <Shuffle className="w-5 h-5" />
          </Button>

          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-white"
              onClick={handlePrevious}
            >
              <SkipBack className="w-8 h-8" />
            </Button>

            <Button
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-black" />
              ) : (
                <Play className="w-8 h-8 text-black ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="p-2 text-white"
              onClick={handleNext}
            >
              <SkipForward className="w-8 h-8" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${repeatMode !== "off" ? "text-green-500" : "text-white/60"}`}
            onClick={() => {
              const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
              const currentIndex = modes.indexOf(repeatMode);
              const nextIndex = (currentIndex + 1) % modes.length;
              setRepeatMode(modes[nextIndex]);
            }}
          >
            <Repeat className="w-5 h-5" />
            {repeatMode === "one" && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full text-xs flex items-center justify-center text-black font-bold">
                1
              </span>
            )}
          </Button>
        </div>

        {/* Voice Control */}
        <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Voice Integration</span>
            </div>
            <Button
              onClick={toggleVoice}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                isVoiceEnabled 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {isVoiceEnabled ? 'Enabled' : 'Enable'}
            </Button>
          </div>
          
          {isVoiceEnabled && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-white/80 text-sm">Volume:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white/80 text-sm w-12">{volume}%</span>
              </div>
              <div className="flex items-center space-x-2 text-white/60 text-xs">
                <span>🔊 Sharing: {currentTrack.title} - {currentTrack.artist}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
