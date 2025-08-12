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
} from "lucide-react";
import { useState } from "react";

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
}

const currentTrack: Track = {
  id: "1",
  title: "Midnight City",
  artist: "M83",
  album: "Hurry Up, We're Dreaming",
  duration: 244,
  coverUrl:
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
};

export const SpotifyApp = ({ onBack }: SpotifyAppProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(87);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black flex flex-col">
      {/* App Header */}
      <div className="flex items-center justify-between p-6">
        <button
          className="oneui-button p-2 -ml-2"
          onClick={onBack}
          data-testid="spotify-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="text-center">
          <p className="text-white/60 text-sm">Playing from</p>
          <p className="text-white font-medium">Your Library</p>
        </div>
        <button className="oneui-button p-2" data-testid="spotify-menu">
          <MoreHorizontal className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-80 h-80 rounded-samsung shadow-2xl overflow-hidden">
          <img
            src={currentTrack.coverUrl}
            alt={`${currentTrack.album} cover`}
            className="w-full h-full object-cover"
            data-testid="album-cover"
          />
        </div>
      </div>

      {/* Track Info */}
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1">
            <h2
              className="text-white text-2xl font-bold mb-1"
              data-testid="track-title"
            >
              {currentTrack.title}
            </h2>
            <p className="text-white/70 text-lg" data-testid="track-artist">
              {currentTrack.artist}
            </p>
          </div>
          <button
            className={`oneui-button p-2 ${isLiked ? "text-samsung-green" : "text-white/60"}`}
            onClick={() => setIsLiked(!isLiked)}
            data-testid="like-button"
          >
            <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-white/20 rounded-full h-1 mb-2">
            <div
              className="bg-samsung-green h-1 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
              data-testid="progress-bar"
            />
          </div>
          <div className="flex justify-between text-white/60 text-sm">
            <span data-testid="current-time">{formatTime(currentTime)}</span>
            <span data-testid="total-time">
              {formatTime(currentTrack.duration)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            className={`oneui-button p-2 ${isShuffled ? "text-samsung-green" : "text-white/60"}`}
            onClick={() => setIsShuffled(!isShuffled)}
            data-testid="shuffle-button"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-6">
            <button
              className="oneui-button p-2 text-white"
              data-testid="previous-button"
            >
              <SkipBack className="w-8 h-8" />
            </button>

            <button
              className="oneui-button w-16 h-16 bg-white rounded-full flex items-center justify-center"
              onClick={() => setIsPlaying(!isPlaying)}
              data-testid="play-pause-button"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-black" />
              ) : (
                <Play className="w-8 h-8 text-black ml-1" />
              )}
            </button>

            <button
              className="oneui-button p-2 text-white"
              data-testid="next-button"
            >
              <SkipForward className="w-8 h-8" />
            </button>
          </div>

          <button
            className={`oneui-button p-2 ${repeatMode !== "off" ? "text-samsung-green" : "text-white/60"}`}
            onClick={() => {
              const modes: Array<"off" | "all" | "one"> = ["off", "all", "one"];
              const currentIndex = modes.indexOf(repeatMode);
              const nextIndex = (currentIndex + 1) % modes.length;
              setRepeatMode(modes[nextIndex]);
            }}
            data-testid="repeat-button"
          >
            <Repeat className="w-5 h-5" />
            {repeatMode === "one" && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-samsung-green rounded-full text-xs flex items-center justify-center text-black font-bold">
                1
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
