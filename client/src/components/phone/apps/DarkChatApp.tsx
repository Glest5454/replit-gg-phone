import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, MapPin, Users, ArrowLeft, Eye, EyeOff, LogOut, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  userId: string;
  username: string;
  message: string;
  messageType: 'text' | 'location';
  locationData?: { lat: number; lng: number; address: string };
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
}

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
}

interface DarkChatAppProps {
  onBack: () => void;
}

export const DarkChatApp = ({ onBack }: DarkChatAppProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({ username: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoggedIn) {
      loadRooms();
    }
  }, [isLoggedIn]);

  const loadRooms = async () => {
    // Mock rooms data - in real app this would be API call
    setRooms([
      { id: "1", name: "General Chat", description: "Main discussion room", memberCount: 15 },
      { id: "2", name: "Gaming Zone", description: "Talk about games", memberCount: 8 },
      { id: "3", name: "Music Lovers", description: "Share your favorite tracks", memberCount: 12 },
      { id: "4", name: "Tech Talk", description: "Technology discussions", memberCount: 6 },
    ]);
  };

  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Mock login - in real app this would be API call
    setCurrentUser({
      id: "user1",
      username: loginForm.username,
      avatarUrl: undefined,
    });
    setIsLoggedIn(true);
    toast({
      title: "Welcome back!",
      description: `Logged in as ${loginForm.username}`,
    });
  };

  const handleSignup = async () => {
    if (!signupForm.username || !signupForm.password || !signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Mock signup - in real app this would be API call
    setCurrentUser({
      id: "user1",
      username: signupForm.username,
      avatarUrl: undefined,
    });
    setIsLoggedIn(true);
    toast({
      title: "Account created!",
      description: `Welcome ${signupForm.username}`,
    });
  };

  const joinRoom = (room: Room) => {
    setCurrentRoom(room);
    // Mock messages - in real app this would be API call
    setMessages([
      {
        id: "1",
        userId: "user2",
        username: "Anonymous_User",
        message: "Hey everyone! 👋",
        messageType: "text",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        userId: "user3",
        username: "Night_Owl",
        message: "Anyone here from Los Santos?",
        messageType: "text",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !currentRoom || !currentUser) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      message: newMessage,
      messageType: "text",
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const sendLocation = () => {
    if (!currentRoom || !currentUser) return;

    // Mock location data - in real app this would get actual GPS coordinates
    const locationMessage: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      message: "📍 Location shared",
      messageType: "location",
      locationData: {
        lat: 34.0522,
        lng: -118.2437,
        address: "Los Santos, San Andreas"
      },
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, locationMessage]);
    toast({
      title: "Location sent",
      description: "Your location has been shared with the room",
    });
  };

  const createRoom = () => {
    if (!newRoomName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room name",
        variant: "destructive",
      });
      return;
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      name: newRoomName,
      memberCount: 1,
    };

    setRooms(prev => [...prev, newRoom]);
    setNewRoomName("");
    setShowNewRoomForm(false);
    toast({
      title: "Room created",
      description: `Created "${newRoomName}" successfully`,
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentRoom(null);
    setMessages([]);
    setRooms([]);
    setLoginForm({ username: "", password: "" });
    setSignupForm({ username: "", password: "", confirmPassword: "" });
  };

  if (!isLoggedIn) {
    return (
      <div className="h-full bg-gray-900 text-white p-4">
        
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-full max-w-sm space-y-6">
            <button 
                      className="oneui-button p-2 -ml-2" 
                      onClick={onBack}
                      data-testid="contacts-back"
                    >
                      <ArrowLeft className="w-6 h-6 text-white" />
                    </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-green-400">Dark Chat</h1>
              <p className="text-gray-400 mt-2">Anonymous messaging for everyone</p>
            </div>

            {showLogin ? (
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <Button 
                    onClick={handleLogin} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Login
                  </Button>
                </div>
                <p className="text-center mt-4 text-gray-400">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setShowLogin(false)}
                    className="text-green-400 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Choose username"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button 
                    onClick={handleSignup} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Create Account
                  </Button>
                </div>
                <p className="text-center mt-4 text-gray-400">
                  Already have an account?{" "}
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-green-400 hover:underline"
                  >
                    Login
                  </button>
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentRoom) {
    return (
      <div className="h-full bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-green-400">Dark Chat</h1>
              <p className="text-sm text-gray-400">Welcome, {currentUser?.username}</p>
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Rooms List */}
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Available Rooms</h2>
            <Button
              onClick={() => setShowNewRoomForm(true)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Room
            </Button>
          </div>

          {showNewRoomForm && (
            <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
              <div className="space-y-3">
                <Input
                  placeholder="Room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={createRoom}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Create
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNewRoomForm(false);
                      setNewRoomName("");
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-3">
            {rooms.map((room) => (
              <Card
                key={room.id}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors p-4"
                onClick={() => joinRoom(room)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{room.name}</h3>
                    {room.description && (
                      <p className="text-sm text-gray-400 mt-1">{room.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      <Users className="h-3 w-3 mr-1" />
                      {room.memberCount}
                    </Badge>
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
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Chat Header */}
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setCurrentRoom(null)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="font-semibold text-white">{currentRoom.name}</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                  <Users className="h-3 w-3 mr-1" />
                  {currentRoom.memberCount} online
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-green-400">
                {message.username}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="bg-gray-800 rounded-lg p-3 max-w-xs">
              {message.messageType === "location" ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Location shared</span>
                  </div>
                  {message.locationData && (
                    <p className="text-xs text-gray-400">
                      {message.locationData.address}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-white">{message.message}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <Button
            onClick={sendLocation}
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-300 hover:bg-gray-700 p-2"
          >
            <MapPin className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-gray-700 border-gray-600 text-white"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-700 p-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};