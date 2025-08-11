import { 
  type PhoneUser, 
  type InsertPhoneUser,
  type PhoneContact,
  type InsertPhoneContact,
  type PhoneMessage,
  type InsertPhoneMessage,
  type PhoneTransaction,
  type InsertPhoneTransaction,
  type PhoneTweet,
  type InsertPhoneTweet,
  type PhoneNote,
  type InsertPhoneNote,
  type PhonePhoto,
  type InsertPhonePhoto,
  type PhoneYellowPage,
  type InsertPhoneYellowPage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Phone Users
  getPhoneUser(id: string): Promise<PhoneUser | undefined>;
  getPhoneUserByCitizenId(citizenId: string): Promise<PhoneUser | undefined>;
  createPhoneUser(user: InsertPhoneUser): Promise<PhoneUser>;
  updatePhoneUser(id: string, user: Partial<InsertPhoneUser>): Promise<PhoneUser>;

  // Contacts
  getPhoneContacts(userId: string): Promise<PhoneContact[]>;
  createPhoneContact(contact: InsertPhoneContact): Promise<PhoneContact>;
  updatePhoneContact(id: string, contact: Partial<InsertPhoneContact>): Promise<PhoneContact>;
  deletePhoneContact(id: string): Promise<void>;

  // Messages
  getPhoneMessages(userId: string): Promise<PhoneMessage[]>;
  getPhoneConversation(senderId: string, receiverId: string): Promise<PhoneMessage[]>;
  createPhoneMessage(message: InsertPhoneMessage): Promise<PhoneMessage>;
  markPhoneMessageRead(id: string): Promise<void>;

  // Banking Transactions
  getPhoneTransactions(userId: string): Promise<PhoneTransaction[]>;
  createPhoneTransaction(transaction: InsertPhoneTransaction): Promise<PhoneTransaction>;

  // Twitter/Warble
  getPhoneTweets(page: number, limit: number): Promise<PhoneTweet[]>;
  getPhoneTweetsByUser(userId: string): Promise<PhoneTweet[]>;
  createPhoneTweet(tweet: InsertPhoneTweet): Promise<PhoneTweet>;
  likePhoneTweet(id: string): Promise<void>;
  retweetPhoneTweet(id: string): Promise<void>;

  // Notes
  getPhoneNotes(userId: string): Promise<PhoneNote[]>;
  createPhoneNote(note: InsertPhoneNote): Promise<PhoneNote>;
  updatePhoneNote(id: string, note: Partial<InsertPhoneNote>): Promise<PhoneNote>;
  deletePhoneNote(id: string): Promise<void>;

  // Gallery/Photos
  getPhonePhotos(userId: string): Promise<PhonePhoto[]>;
  createPhonePhoto(photo: InsertPhonePhoto): Promise<PhonePhoto>;
  deletePhonePhoto(id: string): Promise<void>;

  // Yellow Pages
  searchYellowPages(query?: string, category?: string): Promise<PhoneYellowPage[]>;
  createYellowPageBusiness(business: InsertPhoneYellowPage): Promise<PhoneYellowPage>;
  updateYellowPageBusiness(id: string, business: Partial<InsertPhoneYellowPage>): Promise<PhoneYellowPage>;
  deleteYellowPageBusiness(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private phoneUsers: Map<string, PhoneUser> = new Map();
  private phoneContacts: Map<string, PhoneContact> = new Map();
  private phoneMessages: Map<string, PhoneMessage> = new Map();
  private phoneTransactions: Map<string, PhoneTransaction> = new Map();
  private phoneTweets: Map<string, PhoneTweet> = new Map();
  private phoneNotes: Map<string, PhoneNote> = new Map();
  private phonePhotos: Map<string, PhonePhoto> = new Map();
  private phoneYellowPages: Map<string, PhoneYellowPage> = new Map();

  // Phone Users
  async getPhoneUser(id: string): Promise<PhoneUser | undefined> {
    return this.phoneUsers.get(id);
  }

  async getPhoneUserByCitizenId(citizenId: string): Promise<PhoneUser | undefined> {
    return Array.from(this.phoneUsers.values()).find(user => user.citizenId === citizenId);
  }

  async createPhoneUser(userData: InsertPhoneUser): Promise<PhoneUser> {
    const id = randomUUID();
    const user: PhoneUser = {
      ...userData,
      id,
      createdAt: new Date()
    };
    this.phoneUsers.set(id, user);
    return user;
  }

  async updatePhoneUser(id: string, userData: Partial<InsertPhoneUser>): Promise<PhoneUser> {
    const user = this.phoneUsers.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...userData };
    this.phoneUsers.set(id, updatedUser);
    return updatedUser;
  }

  // Contacts
  async getPhoneContacts(userId: string): Promise<PhoneContact[]> {
    return Array.from(this.phoneContacts.values())
      .filter(contact => contact.ownerId === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async createPhoneContact(contactData: InsertPhoneContact): Promise<PhoneContact> {
    const id = randomUUID();
    const contact: PhoneContact = {
      ...contactData,
      id,
      createdAt: new Date()
    };
    this.phoneContacts.set(id, contact);
    return contact;
  }

  async updatePhoneContact(id: string, contactData: Partial<InsertPhoneContact>): Promise<PhoneContact> {
    const contact = this.phoneContacts.get(id);
    if (!contact) throw new Error("Contact not found");
    
    const updatedContact = { ...contact, ...contactData };
    this.phoneContacts.set(id, updatedContact);
    return updatedContact;
  }

  async deletePhoneContact(id: string): Promise<void> {
    this.phoneContacts.delete(id);
  }

  // Messages
  async getPhoneMessages(userId: string): Promise<PhoneMessage[]> {
    return Array.from(this.phoneMessages.values())
      .filter(message => message.senderId === userId || message.receiverId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPhoneConversation(senderId: string, receiverId: string): Promise<PhoneMessage[]> {
    return Array.from(this.phoneMessages.values())
      .filter(message => 
        (message.senderId === senderId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === senderId)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createPhoneMessage(messageData: InsertPhoneMessage): Promise<PhoneMessage> {
    const id = randomUUID();
    const message: PhoneMessage = {
      ...messageData,
      id,
      createdAt: new Date()
    };
    this.phoneMessages.set(id, message);
    return message;
  }

  async markPhoneMessageRead(id: string): Promise<void> {
    const message = this.phoneMessages.get(id);
    if (message) {
      this.phoneMessages.set(id, { ...message, read: true });
    }
  }

  // Banking Transactions
  async getPhoneTransactions(userId: string): Promise<PhoneTransaction[]> {
    return Array.from(this.phoneTransactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPhoneTransaction(transactionData: InsertPhoneTransaction): Promise<PhoneTransaction> {
    const id = randomUUID();
    const transaction: PhoneTransaction = {
      ...transactionData,
      id,
      createdAt: new Date()
    };
    this.phoneTransactions.set(id, transaction);
    return transaction;
  }

  // Twitter/Warble
  async getPhoneTweets(page: number = 1, limit: number = 20): Promise<PhoneTweet[]> {
    const tweets = Array.from(this.phoneTweets.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return tweets.slice(startIndex, endIndex);
  }

  async getPhoneTweetsByUser(userId: string): Promise<PhoneTweet[]> {
    return Array.from(this.phoneTweets.values())
      .filter(tweet => tweet.authorId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPhoneTweet(tweetData: InsertPhoneTweet): Promise<PhoneTweet> {
    const id = randomUUID();
    const tweet: PhoneTweet = {
      ...tweetData,
      id,
      createdAt: new Date()
    };
    this.phoneTweets.set(id, tweet);
    return tweet;
  }

  async likePhoneTweet(id: string): Promise<void> {
    const tweet = this.phoneTweets.get(id);
    if (tweet) {
      this.phoneTweets.set(id, { ...tweet, likes: (tweet.likes || 0) + 1 });
    }
  }

  async retweetPhoneTweet(id: string): Promise<void> {
    const tweet = this.phoneTweets.get(id);
    if (tweet) {
      this.phoneTweets.set(id, { ...tweet, retweets: (tweet.retweets || 0) + 1 });
    }
  }

  // Notes
  async getPhoneNotes(userId: string): Promise<PhoneNote[]> {
    return Array.from(this.phoneNotes.values())
      .filter(note => note.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async createPhoneNote(noteData: InsertPhoneNote): Promise<PhoneNote> {
    const id = randomUUID();
    const now = new Date();
    const note: PhoneNote = {
      ...noteData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.phoneNotes.set(id, note);
    return note;
  }

  async updatePhoneNote(id: string, noteData: Partial<InsertPhoneNote>): Promise<PhoneNote> {
    const note = this.phoneNotes.get(id);
    if (!note) throw new Error("Note not found");
    
    const updatedNote = { 
      ...note, 
      ...noteData, 
      updatedAt: new Date() 
    };
    this.phoneNotes.set(id, updatedNote);
    return updatedNote;
  }

  async deletePhoneNote(id: string): Promise<void> {
    this.phoneNotes.delete(id);
  }

  // Gallery/Photos
  async getPhonePhotos(userId: string): Promise<PhonePhoto[]> {
    return Array.from(this.phonePhotos.values())
      .filter(photo => photo.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createPhonePhoto(photoData: InsertPhonePhoto): Promise<PhonePhoto> {
    const id = randomUUID();
    const photo: PhonePhoto = {
      ...photoData,
      id,
      createdAt: new Date()
    };
    this.phonePhotos.set(id, photo);
    return photo;
  }

  async deletePhonePhoto(id: string): Promise<void> {
    this.phonePhotos.delete(id);
  }

  // Yellow Pages
  async searchYellowPages(query?: string, category?: string): Promise<PhoneYellowPage[]> {
    let businesses = Array.from(this.phoneYellowPages.values());

    if (category && category !== 'All') {
      businesses = businesses.filter(business => 
        business.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (query) {
      const searchTerm = query.toLowerCase();
      businesses = businesses.filter(business =>
        business.businessName.toLowerCase().includes(searchTerm) ||
        business.description?.toLowerCase().includes(searchTerm) ||
        business.address?.toLowerCase().includes(searchTerm)
      );
    }

    return businesses.sort((a, b) => {
      // Verified businesses first
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      
      // Then by rating
      return (b.rating || 0) - (a.rating || 0);
    });
  }

  async createYellowPageBusiness(businessData: InsertPhoneYellowPage): Promise<PhoneYellowPage> {
    const id = randomUUID();
    const business: PhoneYellowPage = {
      ...businessData,
      id,
      createdAt: new Date()
    };
    this.phoneYellowPages.set(id, business);
    return business;
  }

  async updateYellowPageBusiness(id: string, businessData: Partial<InsertPhoneYellowPage>): Promise<PhoneYellowPage> {
    const business = this.phoneYellowPages.get(id);
    if (!business) throw new Error("Business not found");
    
    const updatedBusiness = { ...business, ...businessData };
    this.phoneYellowPages.set(id, updatedBusiness);
    return updatedBusiness;
  }

  async deleteYellowPageBusiness(id: string): Promise<void> {
    this.phoneYellowPages.delete(id);
  }
}

export const storage = new MemStorage();
