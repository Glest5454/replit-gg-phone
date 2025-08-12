// NUI Communication Functions for FiveM Integration

declare global {
    interface Window {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ReceiveData: (data: any) => void;
    }
  }
  
  export interface NUICallback {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data: any): void;
  }
  
  export class NUIManager {
    private static callbacks: Map<string, NUICallback[]> = new Map();
  
    static post(action: string, data: any = {}) {
      if (window.postMessage) {
        window.postMessage(
          {
            action,
            data,
          },
          '*'
        );
      }
    }
  
    static registerCallback(action: string, callback: NUICallback) {
      if (!this.callbacks.has(action)) {
        this.callbacks.set(action, []);
      }
      this.callbacks.get(action)?.push(callback);
    }
  
    static removeCallback(action: string, callback: NUICallback) {
      const callbacks = this.callbacks.get(action);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  
    static triggerCallbacks(action: string, data: any) {
      const callbacks = this.callbacks.get(action);
      if (callbacks) {
        callbacks.forEach(callback => callback(data));
      }
    }
  }
  
  // Setup global message handler for NUI callbacks
  window.addEventListener('message', (event) => {
    if (event.data && event.data.action) {
      NUIManager.triggerCallbacks(event.data.action, event.data.data || event.data);
    }
  });
  
  // Banking Functions
  export const bankingAPI = {
    deposit: (amount: number, description: string) => {
      NUIManager.post('bankDeposit', { amount, description });
    },
    
    withdraw: (amount: number, description: string) => {
      NUIManager.post('bankWithdraw', { amount, description });
    },
    
    transfer: (targetAccount: string, amount: number, description: string) => {
      NUIManager.post('bankTransfer', { targetAccount, amount, description });
    }
  };
  
  // Notes Functions
  export const notesAPI = {
    create: (title: string, content: string, color: string) => {
      NUIManager.post('createNote', { title, content, color });
    },
    
    update: (id: string, title: string, content: string, color: string) => {
      NUIManager.post('updateNote', { id, title, content, color });
    },
    
    delete: (id: string) => {
      NUIManager.post('deleteNote', { id });
    }
  };
  
  // Contacts Functions
  export const contactsAPI = {
    add: (name: string, phoneNumber: string) => {
      NUIManager.post('addContact', { name, phoneNumber });
    },
    
    call: (phoneNumber: string) => {
      NUIManager.post('callContact', { phoneNumber });
    },
    
    endCall: () => {
      NUIManager.post('endCall', {});
    }
  };
  
  // Messages Functions
export const messagesAPI = {
  send: (targetNumber: string, message: string) => {
    NUIManager.post('sendMessage', { targetNumber, message });
  },
  
  getMessages: (targetNumber: string) => {
    NUIManager.post('getMessages', { targetNumber });
  },
  
  getAllMessages: () => {
    NUIManager.post('getAllMessages', {});
  }
};
  
  // Twitter Functions
  export const twitterAPI = {
    register: (username: string, email: string, password: string, displayName: string) => {
      NUIManager.post('twitterRegister', { username, email, password, displayName });
    },
    
    login: (username: string, password: string) => {
      NUIManager.post('twitterLogin', { username, password });
    },
    
    logout: () => {
      NUIManager.post('twitterLogout', {});
    },
    
    postTweet: (content: string, imageUrl?: string, location?: string) => {
      NUIManager.post('postTweet', { content, imageUrl, location });
    },
    
    getTweets: () => {
      NUIManager.post('getTweets', {});
    },
    
    likeTweet: (tweetId: string) => {
      NUIManager.post('likeTweet', { tweetId });
    },
    
    retweetTweet: (tweetId: string) => {
      NUIManager.post('retweetTweet', { tweetId });
    },
    
    updateProfile: (displayName: string, bio: string, avatar: string) => {
      NUIManager.post('updateTwitterProfile', { displayName, bio, avatar });
    },
    
    changePassword: (currentPassword: string, newPassword: string) => {
      NUIManager.post('changeTwitterPassword', { currentPassword, newPassword });
    }
  };
  
  // Mail Functions
  export const mailAPI = {
    createAccount: (email: string, password: string, displayName: string) => {
      NUIManager.post('createMailAccount', { email, password, displayName });
    },
    
    send: (receiverEmail: string, subject: string, content: string) => {
      NUIManager.post('sendMail', { receiverEmail, subject, content });
    }
  };
  
  // Phone Control
  export const phoneAPI = {
    close: () => {
      NUIManager.post('closePhone', {});
    }
  };