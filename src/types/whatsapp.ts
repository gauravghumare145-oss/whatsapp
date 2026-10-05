export type LoginMethod = 'email' | 'phone';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  about: string;
  loginMethod: LoginMethod;
  email?: string;
  phone?: string;
  online: boolean;
  lastSeen?: string;
}

export interface SavedProfile {
  id: string;
  name: string;
  avatar: string;
  about: string;
  loginMethod: LoginMethod;
  email?: string;
  phone?: string;
  createdAt: number;
}

export type MessageType = 'text' | 'image' | 'voice' | 'file' | 'location';

export interface MessageReaction {
  emoji: string;
  users: string[]; // user IDs
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  caption?: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: number; // seconds
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
  starred?: boolean;
  replyTo?: {
    id: string;
    senderName: string;
    type: MessageType;
    content: string;
  };
  reactions?: MessageReaction[];
  deletedForEveryone?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  participants: string[]; // user IDs or contact keys
  adminIds?: string[];
  description?: string;
  unreadCount: number;
  lastMessage?: {
    senderId: string;
    senderName: string;
    type: MessageType;
    content: string;
    timestamp: number;
    status: 'sent' | 'delivered' | 'read';
  };
  pinned?: boolean;
  archived?: boolean;
  muted?: boolean;
  customWallpaper?: string;
  disappearingTimer?: number; // hours or 0 for off
  createdAt: number;
}

export interface StatusItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'text' | 'image';
  content: string; // text or image URL
  caption?: string;
  backgroundColor?: string;
  timestamp: number;
  viewers: string[]; // user IDs who saw it
}

export interface ChannelPost {
  id: string;
  content: string;
  imageUrl?: string;
  timestamp: number;
  reactionsCount: number;
}

export interface Channel {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  description: string;
  followersCount: number;
  isFollowing: boolean;
  posts: ChannelPost[];
}

export interface CallLog {
  id: string;
  chatId: string;
  contactName: string;
  contactAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: number;
  duration?: number; // in seconds
}

export interface ActiveCall {
  id: string;
  chatId: string;
  contactName: string;
  contactAvatar: string;
  type: 'audio' | 'video';
  status: 'ringing' | 'connected' | 'ended';
  startedAt?: number;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeakerOn: boolean;
}
