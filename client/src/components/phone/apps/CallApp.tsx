import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  UserPlus,
  Clock,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Trash2,
  Search,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  number: string;
  avatar?: string;
}

interface CallLog {
  id: string;
  contact: Contact;
  type: "incoming" | "outgoing" | "missed";
  duration?: string;
  timestamp: Date;
}

interface ActiveCall {
  contact: Contact;
  duration: number;
  isMuted: boolean;
  isSpeaker: boolean;
  status: "connecting" | "active" | "ended";
}

interface CallAppProps {
  onBack: () => void;
}

export const CallApp = ({ onBack }: CallAppProps) => {
  const [activeTab, setActiveTab] = useState<"dialer" | "recent" | "contacts">("dialer");
  const [dialNumber, setDialNumber] = useState("");
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadCallLogs();
    loadContacts();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall && activeCall.status === "active") {
      interval = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const loadCallLogs = () => {
    // Mock call logs
    setCallLogs([
      {
        id: "1",
        contact: { id: "c1", name: "John Doe", number: "+1 555-0123" },
        type: "outgoing",
        duration: "2:15",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: "2",
        contact: { id: "c2", name: "Emergency Services", number: "911" },
        type: "outgoing",
        duration: "0:45",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: "3",
        contact: { id: "c3", name: "Jane Smith", number: "+1 555-0456" },
        type: "missed",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      },
      {
        id: "4",
        contact: { id: "c4", name: "Pizza Palace", number: "+1 555-7890" },
        type: "incoming",
        duration: "1:30",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
    ]);
  };

  const loadContacts = () => {
    // Mock contacts
    setContacts([
      { id: "c1", name: "John Doe", number: "+1 555-0123" },
      { id: "c2", name: "Emergency Services", number: "911" },
      { id: "c3", name: "Jane Smith", number: "+1 555-0456" },
      { id: "c4", name: "Pizza Palace", number: "+1 555-7890" },
      { id: "c5", name: "Mom", number: "+1 555-0001" },
      { id: "c6", name: "Dad", number: "+1 555-0002" },
      { id: "c7", name: "Work", number: "+1 555-9999" },
    ]);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCallTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const makeCall = (contact?: Contact, number?: string) => {
    const callContact = contact || {
      id: "unknown",
      name: number || dialNumber,
      number: number || dialNumber,
    };

    setActiveCall({
      contact: callContact,
      duration: 0,
      isMuted: false,
      isSpeaker: false,
      status: "connecting",
    });

    // Simulate call connecting
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: "active" } : null);
      toast({
        title: "Call connected",
        description: `Connected to ${callContact.name}`,
      });
    }, 2000);

    // Add to call log
    const newLog: CallLog = {
      id: Date.now().toString(),
      contact: callContact,
      type: "outgoing",
      timestamp: new Date(),
    };
    setCallLogs(prev => [newLog, ...prev]);
  };

  const endCall = () => {
    if (activeCall) {
      // Update call log with duration
      setCallLogs(prev => prev.map(log => 
        log.id === callLogs[0]?.id && log.contact.id === activeCall.contact.id
          ? { ...log, duration: formatDuration(activeCall.duration) }
          : log
      ));

      setActiveCall(null);
      toast({
        title: "Call ended",
        description: `Call duration: ${formatDuration(activeCall.duration)}`,
      });
    }
  };

  const toggleMute = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
      toast({
        title: activeCall.isMuted ? "Unmuted" : "Muted",
        description: activeCall.isMuted ? "Microphone on" : "Microphone off",
      });
    }
  };

  const toggleSpeaker = () => {
    if (activeCall) {
      setActiveCall(prev => prev ? { ...prev, isSpeaker: !prev.isSpeaker } : null);
      toast({
        title: activeCall.isSpeaker ? "Speaker off" : "Speaker on",
        description: activeCall.isSpeaker ? "Using earpiece" : "Using speaker",
      });
    }
  };

  const addDigit = (digit: string) => {
    setDialNumber(prev => prev + digit);
  };

  const removeDigit = () => {
    setDialNumber(prev => prev.slice(0, -1));
  };

  const clearDialer = () => {
    setDialNumber("");
  };

  const deleteCallLog = (logId: string) => {
    setCallLogs(prev => prev.filter(log => log.id !== logId));
    toast({
      title: "Call deleted",
      description: "Call removed from history",
    });
  };

  const getCallIcon = (type: CallLog["type"]) => {
    switch (type) {
      case "incoming":
        return <PhoneIncoming className="h-4 w-4 text-green-600" />;
      case "outgoing":
        return <PhoneOutgoing className="h-4 w-4 text-blue-600" />;
      case "missed":
        return <PhoneMissed className="h-4 w-4 text-red-600" />;
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.number.includes(searchQuery)
  );

  if (activeCall) {
    return (
      <div className="h-full bg-gray-900 text-white flex flex-col items-center justify-center p-8">
        {/* Call Status */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-4xl font-bold">
              {activeCall.contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">{activeCall.contact.name}</h2>
          <p className="text-gray-400 mb-2">{activeCall.contact.number}</p>
          <p className="text-lg">
            {activeCall.status === "connecting" ? "Connecting..." : formatDuration(activeCall.duration)}
          </p>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          <Button
            onClick={toggleMute}
            variant={activeCall.isMuted ? "default" : "outline"}
            size="lg"
            className={`w-16 h-16 rounded-full ${
              activeCall.isMuted 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {activeCall.isMuted ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>

          <Button
            onClick={toggleSpeaker}
            variant={activeCall.isSpeaker ? "default" : "outline"}
            size="lg"
            className={`w-16 h-16 rounded-full ${
              activeCall.isSpeaker 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {activeCall.isSpeaker ? (
              <Volume2 className="h-6 w-6" />
            ) : (
              <VolumeX className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* End Call Button */}
        <Button
          onClick={endCall}
          size="lg"
          className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700"
        >
          <PhoneOff className="h-8 w-8" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <button 
          className="oneui-button p-2 -ml-2" 
          onClick={onBack}
          data-testid="contacts-back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold">Phone</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("dialer")}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === "dialer"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Dialer
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === "recent"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === "contacts"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          Contacts
        </button>
      </div>

      {/* Content */}
      <div className="h-full">
        {activeTab === "dialer" && (
          <div className="p-6">
            {/* Number Display */}
            <div className="text-center mb-8">
              <Input
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                placeholder="Enter number..."
                className="text-2xl text-center border-0 bg-transparent text-gray-900 dark:text-white"
                readOnly
              />
            </div>

            {/* Dialer Pad */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
                <Button
                  key={digit}
                  onClick={() => addDigit(digit)}
                  variant="outline"
                  size="lg"
                  className="h-16 text-xl font-semibold"
                >
                  {digit}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              {dialNumber && (
                <Button
                  onClick={removeDigit}
                  variant="ghost"
                  size="lg"
                  className="w-16 h-16 rounded-full"
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              )}
              
              <Button
                onClick={() => makeCall(undefined, dialNumber)}
                disabled={!dialNumber}
                size="lg"
                className="w-20 h-20 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
              >
                <PhoneCall className="h-8 w-8" />
              </Button>

              {dialNumber && (
                <Button
                  onClick={clearDialer}
                  variant="ghost"
                  size="lg"
                  className="w-16 h-16 rounded-full"
                >
                  <PhoneOff className="h-6 w-6" />
                </Button>
              )}
            </div>
          </div>
        )}

        {activeTab === "recent" && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Calls</h2>
            {callLogs.length > 0 ? (
              <div className="space-y-2">
                {callLogs.map((log) => (
                  <Card key={log.id} className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getCallIcon(log.type)}
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{log.contact.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{log.contact.number}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{formatCallTime(log.timestamp)}</span>
                            {log.duration && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{log.duration}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => makeCall(log.contact)}
                          variant="ghost"
                          size="sm"
                          className="p-2"
                        >
                          <PhoneCall className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          onClick={() => deleteCallLog(log.id)}
                          variant="ghost"
                          size="sm"
                          className="p-2"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No recent calls</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="pl-10"
              />
            </div>

            {/* Contacts List */}
            {filteredContacts.length > 0 ? (
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <Card key={contact.id} className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {contact.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{contact.number}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => makeCall(contact)}
                        variant="ghost"
                        size="sm"
                        className="p-2"
                      >
                        <PhoneCall className="h-4 w-4 text-green-600" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery ? `No contacts found for "${searchQuery}"` : "No contacts"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};