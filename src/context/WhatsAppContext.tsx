import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  SavedProfile,
  Chat,
  Message,
  MessageType,
  StatusItem,
  Channel,
  CallLog,
  ActiveCall,
} from '../types/whatsapp';
import {
  DEFAULT_USER,
  INITIAL_SAVED_PROFILES,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_STATUSES,
  INITIAL_CHANNELS,
  INITIAL_CALLS,
  generateBotReply,
} from '../utils/storage';
import { sound } from '../utils/audio';

interface WhatsAppContextType {
  // Auth
  currentUser: UserProfile | null;
  loginWithEmail: (email: string, name?: string, avatar?: string) => void;
  loginWithPhone: (phone: string, countryCode?: string, name?: string, avatar?: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  switchAccount: (userId: string) => void;

  // Saved Profiles / Directory
  savedProfiles: SavedProfile[];
  addProfile: (profile: Omit<SavedProfile, 'id' | 'createdAt'>) => SavedProfile;
  deleteProfile: (id: string) => void;
  switchToProfile: (profileId: string) => void;
  startChatWithProfile: (profile: SavedProfile) => string;

  // Chats
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | null;
  selectChat: (chatId: string) => void;
  createDirectChat: (identifier: string, name: string, avatar?: string) => string;
  createGroupChat: (name: string, participantIds: string[], description?: string, avatar?: string) => string;
  pinChat: (chatId: string) => void;
  archiveChat: (chatId: string) => void;
  muteChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  clearChatMessages: (chatId: string) => void;

  // Messages
  activeMessages: Message[];
  allMessages: Record<string, Message[]>;
  sendMessage: (
    content: string,
    type?: MessageType,
    extra?: {
      caption?: string;
      mediaUrl?: string;
      fileName?: string;
      fileSize?: string;
      audioDuration?: number;
    }
  ) => void;
  addReaction: (messageId: string, emoji: string) => void;
  starMessage: (messageId: string) => void;
  deleteMessage: (messageId: string, forEveryone: boolean) => void;
  replyingToMessage: Message | null;
  setReplyingToMessage: (msg: Message | null) => void;
  isContactTyping: boolean;

  // Status / Stories
  statuses: StatusItem[];
  addStatus: (type: 'text' | 'image', content: string, caption?: string, backgroundColor?: string) => void;
  viewStatus: (statusId: string) => void;
  activeViewingStatus: StatusItem | null;
  setActiveViewingStatus: (status: StatusItem | null) => void;

  // Channels
  channels: Channel[];
  toggleFollowChannel: (channelId: string) => void;

  // Calls
  calls: CallLog[];
  activeCall: ActiveCall | null;
  startCall: (chatId: string, type: 'audio' | 'video') => void;
  endCall: () => void;
  toggleCallMute: () => void;
  toggleCallVideo: () => void;

  // UI state & Modals
  sidebarTab: 'chats' | 'status' | 'channels' | 'calls';
  setSidebarTab: (tab: 'chats' | 'status' | 'channels' | 'calls') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: 'all' | 'unread' | 'favorites' | 'groups';
  setFilterType: (filter: 'all' | 'unread' | 'favorites' | 'groups') => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean | ((prev: boolean) => boolean)) => void;
  wallpaper: string;
  setWallpaper: (wp: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  // Modals
  isNewChatModalOpen: boolean;
  setIsNewChatModalOpen: (open: boolean) => void;
  isNewGroupModalOpen: boolean;
  setIsNewGroupModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isContactInfoOpen: boolean;
  setIsContactInfoOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDownloadModalOpen: boolean;
  setIsDownloadModalOpen: (open: boolean) => void;
  isProfilesModalOpen: boolean;
  setIsProfilesModalOpen: (open: boolean) => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | undefined>(undefined);

export const WhatsAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('wa_current_user_v2');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Saved profiles directory
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>(() => {
    try {
      const saved = localStorage.getItem('wa_saved_profiles_v2');
      return saved ? JSON.parse(saved) : INITIAL_SAVED_PROFILES;
    } catch {
      return INITIAL_SAVED_PROFILES;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState<boolean>(false);

  // Chats & Messages
  const [chats, setChats] = useState<Chat[]>(() => {
    try {
      const saved = localStorage.getItem('wa_chats_v2');
      return saved ? JSON.parse(saved) : INITIAL_CHATS;
    } catch {
      return INITIAL_CHATS;
    }
  });

  const [activeChatId, setActiveChatId] = useState<string | null>('chat_whatsapp_official');

  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem('wa_messages_v2');
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  // Statuses
  const [statuses, setStatuses] = useState<StatusItem[]>(() => {
    try {
      const saved = localStorage.getItem('wa_statuses_v2');
      return saved ? JSON.parse(saved) : INITIAL_STATUSES;
    } catch {
      return INITIAL_STATUSES;
    }
  });
  const [activeViewingStatus, setActiveViewingStatus] = useState<StatusItem | null>(null);

  // Channels
  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      const saved = localStorage.getItem('wa_channels_v2');
      return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
    } catch {
      return INITIAL_CHANNELS;
    }
  });

  // Calls
  const [calls, setCalls] = useState<CallLog[]>(() => {
    try {
      const saved = localStorage.getItem('wa_calls_v2');
      return saved ? JSON.parse(saved) : INITIAL_CALLS;
    } catch {
      return INITIAL_CALLS;
    }
  });
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);

  // UI state & Preferences
  const [sidebarTab, setSidebarTab] = useState<'chats' | 'status' | 'channels' | 'calls'>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'favorites' | 'groups'>('all');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('wa_dark_mode');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [wallpaper, setWallpaper] = useState<string>(() => {
    return localStorage.getItem('wa_wallpaper') || 'doodle';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals & Panels
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const [typingMap, setTypingMap] = useState<Record<string, boolean>>({});

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('wa_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Sync localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('wa_current_user_v2', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('wa_saved_profiles_v2', JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  useEffect(() => {
    localStorage.setItem('wa_chats_v2', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('wa_messages_v2', JSON.stringify(allMessages));
  }, [allMessages]);

  useEffect(() => {
    localStorage.setItem('wa_statuses_v2', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('wa_channels_v2', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('wa_calls_v2', JSON.stringify(calls));
  }, [calls]);

  useEffect(() => {
    localStorage.setItem('wa_wallpaper', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    sound.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Multi-tab BroadcastChannel sync
  useEffect(() => {
    if (typeof window === 'undefined' || !window.BroadcastChannel) return;
    const channel = new BroadcastChannel('whatsapp_web_sync');

    channel.onmessage = (event) => {
      const { type, payload } = event.data || {};
      if (type === 'NEW_MESSAGE') {
        const { chatId, message } = payload;
        setAllMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), message],
        }));
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  lastMessage: {
                    senderId: message.senderId,
                    senderName: message.senderName,
                    type: message.type,
                    content: message.content,
                    timestamp: message.timestamp,
                    status: message.status,
                  },
                }
              : c
          )
        );
        sound.playMessageReceived();
      } else if (type === 'PROFILES_UPDATED') {
        setSavedProfiles(payload.profiles);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // Login with Email / Gmail
  const loginWithEmail = useCallback((email: string, name?: string, avatar?: string) => {
    const displayName = name?.trim() || email.split('@')[0] || 'User';
    const profileAvatar =
      avatar ||
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

    const user: UserProfile = {
      id: `user_${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: displayName,
      about: 'Available | Using WhatsApp Web',
      avatar: profileAvatar,
      loginMethod: 'email',
      email: email.trim(),
      online: true,
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);

    // Auto-save into profiles directory if not already there
    setSavedProfiles((prev) => {
      if (prev.some((p) => p.email === user.email || p.id === user.id)) return prev;
      return [
        ...prev,
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          about: user.about,
          loginMethod: user.loginMethod,
          email: user.email,
          createdAt: Date.now(),
        },
      ];
    });
  }, []);

  // Login with Phone Number
  const loginWithPhone = useCallback((phone: string, countryCode = '+91', name?: string, avatar?: string) => {
    const fullPhone = `${countryCode} ${phone.trim()}`;
    const displayName = name?.trim() || fullPhone;
    const profileAvatar =
      avatar ||
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(phone)}&backgroundColor=ffd5dc,ffdfbf`;

    const user: UserProfile = {
      id: `user_${phone.replace(/[^0-9]/g, '')}`,
      name: displayName,
      about: 'Available | Using WhatsApp Web',
      avatar: profileAvatar,
      loginMethod: 'phone',
      phone: fullPhone,
      online: true,
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);

    // Auto-save into profiles directory
    setSavedProfiles((prev) => {
      if (prev.some((p) => p.phone === user.phone || p.id === user.id)) return prev;
      return [
        ...prev,
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          about: user.about,
          loginMethod: user.loginMethod,
          phone: user.phone,
          createdAt: Date.now(),
        },
      ];
    });
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    // Also update saved profiles
    if (currentUser) {
      setSavedProfiles((prev) =>
        prev.map((p) => (p.id === currentUser.id ? { ...p, ...updates } : p))
      );
    }
  }, [currentUser]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  }, []);

  // Add new Profile to directory
  const addProfile = useCallback((profileData: Omit<SavedProfile, 'id' | 'createdAt'>): SavedProfile => {
    const newId = `profile_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newProfile: SavedProfile = {
      ...profileData,
      id: newId,
      createdAt: Date.now(),
    };
    setSavedProfiles((prev) => {
      const updated = [newProfile, ...prev];
      // Broadcast to other tabs
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        try {
          const ch = new BroadcastChannel('whatsapp_web_sync');
          ch.postMessage({ type: 'PROFILES_UPDATED', payload: { profiles: updated } });
          ch.close();
        } catch {
          // ignore
        }
      }
      return updated;
    });
    return newProfile;
  }, []);

  // Delete Profile
  const deleteProfile = useCallback((id: string) => {
    setSavedProfiles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Switch to Profile (Login as this user)
  const switchToProfile = useCallback((profileId: string) => {
    const target = savedProfiles.find((p) => p.id === profileId);
    if (!target) return;

    const user: UserProfile = {
      id: target.id,
      name: target.name,
      about: target.about,
      avatar: target.avatar,
      loginMethod: target.loginMethod,
      email: target.email,
      phone: target.phone,
      online: true,
    };
    setCurrentUser(user);
    setIsProfilesModalOpen(false);
  }, [savedProfiles]);

  const switchAccount = useCallback((userId: string) => {
    switchToProfile(userId);
  }, [switchToProfile]);

  // Start chat with saved profile
  const startChatWithProfile = useCallback((profile: SavedProfile): string => {
    const existing = chats.find(
      (c) => !c.isGroup && (c.name.toLowerCase() === profile.name.toLowerCase() || c.participants.includes(profile.id))
    );
    if (existing) {
      setActiveChatId(existing.id);
      setIsProfilesModalOpen(false);
      return existing.id;
    }

    const chatId = `chat_${profile.id}`;
    const newChat: Chat = {
      id: chatId,
      name: profile.name,
      avatar: profile.avatar,
      isGroup: false,
      participants: [currentUser?.id || 'user_gaurav', profile.id],
      unreadCount: 0,
      createdAt: Date.now(),
    };

    setChats((prev) => [newChat, ...prev]);
    setAllMessages((prev) => ({
      ...prev,
      [chatId]: [
        {
          id: `msg_init_${Date.now()}`,
          chatId,
          senderId: 'system',
          senderName: 'System',
          type: 'text',
          content: `🔒 Messages and calls are end-to-end encrypted with ${profile.name}.`,
          timestamp: Date.now(),
          status: 'read',
        },
      ],
    }));

    setActiveChatId(chatId);
    setIsProfilesModalOpen(false);
    return chatId;
  }, [chats, currentUser]);

  // Active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const activeMessages = (activeChatId && allMessages[activeChatId]) || [];
  const isContactTyping = Boolean(activeChatId && typingMap[activeChatId]);

  // Select chat & mark as read
  const selectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
    setAllMessages((prev) => {
      const chatMsgs = prev[chatId];
      if (!chatMsgs) return prev;
      return {
        ...prev,
        [chatId]: chatMsgs.map((m) => ({ ...m, status: 'read' as const })),
      };
    });
  }, []);

  // Create direct chat
  const createDirectChat = useCallback(
    (identifier: string, name: string, avatar?: string): string => {
      const chatId = `chat_${Date.now()}`;
      const newChat: Chat = {
        id: chatId,
        name: name || identifier,
        avatar:
          avatar ||
          `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(identifier)}`,
        isGroup: false,
        participants: [currentUser?.id || 'user_gaurav', `contact_${Date.now()}`],
        unreadCount: 0,
        createdAt: Date.now(),
      };

      setChats((prev) => [newChat, ...prev]);
      setAllMessages((prev) => ({
        ...prev,
        [chatId]: [
          {
            id: `msg_welcome_${Date.now()}`,
            chatId,
            senderId: 'system',
            senderName: 'System',
            type: 'text',
            content: '🔒 Messages and calls are end-to-end encrypted. No one outside of this chat can read or listen to them.',
            timestamp: Date.now(),
            status: 'read',
          },
        ],
      }));
      setActiveChatId(chatId);
      return chatId;
    },
    [currentUser]
  );

  // Create group chat
  const createGroupChat = useCallback(
    (name: string, participantIds: string[], description?: string, avatar?: string): string => {
      const chatId = `group_${Date.now()}`;
      const groupChat: Chat = {
        id: chatId,
        name,
        avatar:
          avatar ||
          `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
        isGroup: true,
        participants: [currentUser?.id || 'user_gaurav', ...participantIds],
        adminIds: [currentUser?.id || 'user_gaurav'],
        description,
        unreadCount: 0,
        createdAt: Date.now(),
      };

      setChats((prev) => [groupChat, ...prev]);
      setAllMessages((prev) => ({
        ...prev,
        [chatId]: [
          {
            id: `msg_group_created_${Date.now()}`,
            chatId,
            senderId: 'system',
            senderName: 'System',
            type: 'text',
            content: `You created group "${name}"`,
            timestamp: Date.now(),
            status: 'read',
          },
        ],
      }));
      setActiveChatId(chatId);
      return chatId;
    },
    [currentUser]
  );

  const pinChat = useCallback((chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, pinned: !c.pinned } : c))
    );
  }, []);

  const archiveChat = useCallback((chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, archived: !c.archived } : c))
    );
  }, []);

  const muteChat = useCallback((chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, muted: !c.muted } : c))
    );
  }, []);

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
    },
    [activeChatId]
  );

  const clearChatMessages = useCallback((chatId: string) => {
    setAllMessages((prev) => ({
      ...prev,
      [chatId]: [],
    }));
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, lastMessage: undefined } : c))
    );
  }, []);

  // Send message
  const sendMessage = useCallback(
    (
      content: string,
      type: MessageType = 'text',
      extra?: {
        caption?: string;
        mediaUrl?: string;
        fileName?: string;
        fileSize?: string;
        audioDuration?: number;
      }
    ) => {
      if (!activeChatId || !currentUser) return;

      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newMessage: Message = {
        id: messageId,
        chatId: activeChatId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        type,
        content,
        caption: extra?.caption,
        mediaUrl: extra?.mediaUrl,
        fileName: extra?.fileName,
        fileSize: extra?.fileSize,
        audioDuration: extra?.audioDuration,
        timestamp: Date.now(),
        status: 'sent',
        replyTo: replyingToMessage
          ? {
              id: replyingToMessage.id,
              senderName: replyingToMessage.senderName,
              type: replyingToMessage.type,
              content: replyingToMessage.content,
            }
          : undefined,
      };

      sound.playMessageSent();
      setReplyingToMessage(null);

      // Append message
      setAllMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), newMessage],
      }));

      // Update chat's last message
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                lastMessage: {
                  senderId: currentUser.id,
                  senderName: currentUser.name,
                  type,
                  content: type === 'text' ? content : `${type.toUpperCase()}: ${extra?.caption || content}`,
                  timestamp: Date.now(),
                  status: 'sent',
                },
              }
            : c
        )
      );

      // Multi-tab broadcast
      if (typeof window !== 'undefined' && window.BroadcastChannel) {
        try {
          const channel = new BroadcastChannel('whatsapp_web_sync');
          channel.postMessage({
            type: 'NEW_MESSAGE',
            payload: { chatId: activeChatId, message: newMessage },
          });
          channel.close();
        } catch {
          // ignore
        }
      }

      // Delivered tick after 600ms
      setTimeout(() => {
        setAllMessages((prev) => ({
          ...prev,
          [activeChatId]: (prev[activeChatId] || []).map((m) =>
            m.id === messageId ? { ...m, status: 'delivered' } : m
          ),
        }));
      }, 600);

      // Read tick & contextual response simulation
      const currentChat = chats.find((c) => c.id === activeChatId);
      if (currentChat && !currentChat.isGroup && currentChat.name !== 'You') {
        setTimeout(() => {
          setAllMessages((prev) => ({
            ...prev,
            [activeChatId]: (prev[activeChatId] || []).map((m) =>
              m.id === messageId ? { ...m, status: 'read' } : m
            ),
          }));
        }, 1200);

        setTimeout(() => {
          setTypingMap((prev) => ({ ...prev, [activeChatId]: true }));
        }, 1600);

        setTimeout(() => {
          setTypingMap((prev) => ({ ...prev, [activeChatId]: false }));

          const botReplyText = generateBotReply(currentChat.name, content);
          const replyMessageId = `bot_${Date.now()}`;
          const botMessage: Message = {
            id: replyMessageId,
            chatId: activeChatId,
            senderId: currentChat.participants[1] || 'contact_bot',
            senderName: currentChat.name,
            senderAvatar: currentChat.avatar,
            type: 'text',
            content: botReplyText,
            timestamp: Date.now(),
            status: 'read',
          };

          setAllMessages((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), botMessage],
          }));

          setChats((prev) =>
            prev.map((c) =>
              c.id === activeChatId
                ? {
                    ...c,
                    lastMessage: {
                      senderId: botMessage.senderId,
                      senderName: botMessage.senderName,
                      type: 'text',
                      content: botReplyText,
                      timestamp: Date.now(),
                      status: 'read',
                    },
                  }
                : c
            )
          );

          sound.playMessageReceived();
        }, 3000);
      }
    },
    [activeChatId, currentUser, replyingToMessage, chats]
  );

  // Reactions
  const addReaction = useCallback((messageId: string, emoji: string) => {
    if (!activeChatId || !currentUser) return;
    setAllMessages((prev) => {
      const msgs = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: msgs.map((m) => {
          if (m.id !== messageId) return m;
          const currentReactions = m.reactions || [];
          const existing = currentReactions.find((r) => r.emoji === emoji);

          let updatedReactions;
          if (existing) {
            if (existing.users.includes(currentUser.id)) {
              updatedReactions = currentReactions
                .map((r) =>
                  r.emoji === emoji
                    ? { ...r, users: r.users.filter((u) => u !== currentUser.id) }
                    : r
                )
                .filter((r) => r.users.length > 0);
            } else {
              updatedReactions = currentReactions.map((r) =>
                r.emoji === emoji ? { ...r, users: [...r.users, currentUser.id] } : r
              );
            }
          } else {
            updatedReactions = [...currentReactions, { emoji, users: [currentUser.id] }];
          }
          return { ...m, reactions: updatedReactions };
        }),
      };
    });
  }, [activeChatId, currentUser]);

  // Star message
  const starMessage = useCallback((messageId: string) => {
    if (!activeChatId) return;
    setAllMessages((prev) => {
      const msgs = prev[activeChatId] || [];
      return {
        ...prev,
        [activeChatId]: msgs.map((m) =>
          m.id === messageId ? { ...m, starred: !m.starred } : m
        ),
      };
    });
  }, [activeChatId]);

  // Delete message
  const deleteMessage = useCallback((messageId: string, forEveryone: boolean) => {
    if (!activeChatId) return;
    setAllMessages((prev) => {
      const msgs = prev[activeChatId] || [];
      if (forEveryone) {
        return {
          ...prev,
          [activeChatId]: msgs.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  content: '🚫 This message was deleted',
                  deletedForEveryone: true,
                  mediaUrl: undefined,
                  type: 'text',
                }
              : m
          ),
        };
      } else {
        return {
          ...prev,
          [activeChatId]: msgs.filter((m) => m.id !== messageId),
        };
      }
    });
  }, [activeChatId]);

  // Statuses
  const addStatus = useCallback(
    (type: 'text' | 'image', content: string, caption?: string, backgroundColor?: string) => {
      if (!currentUser) return;
      const newStatus: StatusItem = {
        id: `st_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        type,
        content,
        caption,
        backgroundColor: backgroundColor || '#00a884',
        timestamp: Date.now(),
        viewers: [],
      };
      setStatuses((prev) => [newStatus, ...prev]);
    },
    [currentUser]
  );

  const viewStatus = useCallback(
    (statusId: string) => {
      if (!currentUser) return;
      setStatuses((prev) =>
        prev.map((s) =>
          s.id === statusId && !s.viewers.includes(currentUser.id)
            ? { ...s, viewers: [...s.viewers, currentUser.id] }
            : s
        )
      );
    },
    [currentUser]
  );

  // Channels
  const toggleFollowChannel = useCallback((channelId: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? {
              ...c,
              isFollowing: !c.isFollowing,
              followersCount: c.isFollowing ? c.followersCount - 1 : c.followersCount + 1,
            }
          : c
      )
    );
  }, []);

  // Audio / Video Calls
  const startCall = useCallback(
    (chatId: string, type: 'audio' | 'video') => {
      const targetChat = chats.find((c) => c.id === chatId);
      if (!targetChat) return;

      const newCall: ActiveCall = {
        id: `call_${Date.now()}`,
        chatId,
        contactName: targetChat.name,
        contactAvatar: targetChat.avatar,
        type,
        status: 'ringing',
        isMuted: false,
        isVideoOff: false,
        isSpeakerOn: true,
      };

      setActiveCall(newCall);
      sound.startRingtone();

      setTimeout(() => {
        sound.stopRingtone();
        setActiveCall((prev) =>
          prev && prev.id === newCall.id
            ? { ...prev, status: 'connected', startedAt: Date.now() }
            : prev
        );
      }, 3000);
    },
    [chats]
  );

  const endCall = useCallback(() => {
    sound.stopRingtone();
    if (activeCall) {
      const duration = activeCall.startedAt
        ? Math.floor((Date.now() - activeCall.startedAt) / 1000)
        : 0;

      const log: CallLog = {
        id: `log_${Date.now()}`,
        chatId: activeCall.chatId,
        contactName: activeCall.contactName,
        contactAvatar: activeCall.contactAvatar,
        type: activeCall.type,
        direction: 'outgoing',
        timestamp: Date.now(),
        duration,
      };
      setCalls((prev) => [log, ...prev]);
    }
    setActiveCall(null);
  }, [activeCall]);

  const toggleCallMute = useCallback(() => {
    setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  }, []);

  const toggleCallVideo = useCallback(() => {
    setActiveCall((prev) => (prev ? { ...prev, isVideoOff: !prev.isVideoOff } : null));
  }, []);

  return (
    <WhatsAppContext.Provider
      value={{
        currentUser,
        loginWithEmail,
        loginWithPhone,
        updateProfile,
        logout,
        switchAccount,
        savedProfiles,
        addProfile,
        deleteProfile,
        switchToProfile,
        startChatWithProfile,
        chats,
        activeChatId,
        activeChat,
        selectChat,
        createDirectChat,
        createGroupChat,
        pinChat,
        archiveChat,
        muteChat,
        deleteChat,
        clearChatMessages,
        activeMessages,
        allMessages,
        sendMessage,
        addReaction,
        starMessage,
        deleteMessage,
        replyingToMessage,
        setReplyingToMessage,
        isContactTyping,
        statuses,
        addStatus,
        viewStatus,
        activeViewingStatus,
        setActiveViewingStatus,
        channels,
        toggleFollowChannel,
        calls,
        activeCall,
        startCall,
        endCall,
        toggleCallMute,
        toggleCallVideo,
        sidebarTab,
        setSidebarTab,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        darkMode,
        setDarkMode,
        wallpaper,
        setWallpaper,
        soundEnabled,
        setSoundEnabled,
        isNewChatModalOpen,
        setIsNewChatModalOpen,
        isNewGroupModalOpen,
        setIsNewGroupModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isContactInfoOpen,
        setIsContactInfoOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        isProfilesModalOpen,
        setIsProfilesModalOpen,
      }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
};

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) {
    throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  }
  return context;
};
