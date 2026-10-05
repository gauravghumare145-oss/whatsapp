import { Chat, Message, StatusItem, Channel, CallLog, UserProfile, SavedProfile } from '../types/whatsapp';

export const DEFAULT_USER: UserProfile = {
  id: 'user_gaurav',
  name: 'Gaurav',
  about: 'Available | Using WhatsApp Web',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  loginMethod: 'email',
  email: 'gauravghumare145@gmail.com',
  online: true,
};

export const INITIAL_SAVED_PROFILES: SavedProfile[] = [
  {
    id: 'user_gaurav',
    name: 'Gaurav',
    about: 'Available | Using WhatsApp Web',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    loginMethod: 'email',
    email: 'gauravghumare145@gmail.com',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'profile_work_colleague',
    name: 'Work Colleague',
    about: 'In a meeting • Available on chat',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    loginMethod: 'email',
    email: 'colleague@workspace.com',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'profile_mobile_user',
    name: 'Mobile Contact (+91)',
    about: 'Hey there! I am using WhatsApp.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    loginMethod: 'phone',
    phone: '+91 98765 43210',
    createdAt: Date.now() - 86400000 * 2,
  },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_whatsapp_official',
    name: 'WhatsApp Official 🟢',
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=200&q=80',
    isGroup: false,
    participants: ['user_gaurav', 'whatsapp_support'],
    unreadCount: 0,
    createdAt: Date.now() - 86400000 * 2,
    lastMessage: {
      senderId: 'whatsapp_support',
      senderName: 'WhatsApp Official',
      type: 'text',
      content: 'Welcome! Tap "Download App" to install on desktop/mobile, or add your friends’ profiles to start chatting.',
      timestamp: Date.now() - 1000 * 60 * 15,
      status: 'read',
    },
  },
  {
    id: 'chat_work_colleague',
    name: 'Work Colleague',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    isGroup: false,
    participants: ['user_gaurav', 'profile_work_colleague'],
    unreadCount: 1,
    createdAt: Date.now() - 86400000 * 1,
    lastMessage: {
      senderId: 'profile_work_colleague',
      senderName: 'Work Colleague',
      type: 'text',
      content: 'Hi Gaurav! Ready to collaborate on this app.',
      timestamp: Date.now() - 1000 * 60 * 30,
      status: 'delivered',
    },
  },
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  chat_whatsapp_official: [
    {
      id: 'm_w1',
      chatId: 'chat_whatsapp_official',
      senderId: 'whatsapp_support',
      senderName: 'WhatsApp Official',
      type: 'text',
      content: 'Welcome to your professional WhatsApp Web application! 🎉\n\nHere is how you can use it:\n1. 📲 Download the App: Tap the "Download App" button at the top to install it as a standalone app on your phone, tablet, or PC.\n2. 👥 Saved Profiles: Tap "Profiles" to add new friend profiles or switch between accounts.\n3. 🔒 End-to-end encrypted: All chats, voice notes, calls, and files are secure.',
      timestamp: Date.now() - 1000 * 60 * 60 * 2,
      status: 'read',
    },
    {
      id: 'm_w2',
      chatId: 'chat_whatsapp_official',
      senderId: 'whatsapp_support',
      senderName: 'WhatsApp Official',
      type: 'text',
      content: 'Welcome! Tap "Download App" to install on desktop/mobile, or add your friends’ profiles to start chatting.',
      timestamp: Date.now() - 1000 * 60 * 15,
      status: 'read',
    },
  ],
  chat_work_colleague: [
    {
      id: 'm_wc1',
      chatId: 'chat_work_colleague',
      senderId: 'profile_work_colleague',
      senderName: 'Work Colleague',
      type: 'text',
      content: 'Hi Gaurav! Ready to collaborate on this app.',
      timestamp: Date.now() - 1000 * 60 * 30,
      status: 'delivered',
    },
  ],
};

export const INITIAL_STATUSES: StatusItem[] = [
  {
    id: 'st_official_1',
    userId: 'whatsapp_support',
    userName: 'WhatsApp Official',
    userAvatar: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=200&q=80',
    type: 'text',
    content: '🔒 Private messaging. Download WhatsApp Web on mobile & desktop to stay connected anywhere!',
    backgroundColor: '#005c4b',
    timestamp: Date.now() - 1000 * 60 * 60,
    viewers: [],
  },
];

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'chan_whatsapp',
    name: 'WhatsApp Official',
    avatar: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=200&q=80',
    verified: true,
    description: 'Official WhatsApp announcements, product updates, and tips.',
    followersCount: 154000000,
    isFollowing: true,
    posts: [
      {
        id: 'cp_1',
        content: '✨ You can now download and install WhatsApp directly to your home screen or desktop without needing an app store!',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        timestamp: Date.now() - 86400000 * 1,
        reactionsCount: 54200,
      },
    ],
  },
  {
    id: 'chan_tech_pro',
    name: 'Professional Tech Updates',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80',
    verified: true,
    description: 'Enterprise communications, real-time collaboration, and developer tools.',
    followersCount: 1200000,
    isFollowing: false,
    posts: [
      {
        id: 'cp_2',
        content: 'Real-time multi-tab sync with BroadcastChannel and WebSockets empowers seamless messaging across distributed web apps.',
        timestamp: Date.now() - 86400000 * 2,
        reactionsCount: 18900,
      },
    ],
  },
];

export const INITIAL_CALLS: CallLog[] = [];

// Professional contextual responses
export function generateBotReply(contactName: string, userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (contactName.includes('WhatsApp')) {
    if (lower.includes('download') || lower.includes('install')) {
      return 'To install the app, click the "Download App" button at the top header. You can install it on Android, iOS Safari (via Share > Add to Home Screen), or Chrome/Windows/Mac.';
    }
    if (lower.includes('profile') || lower.includes('contact') || lower.includes('friend')) {
      return 'You can add friends by clicking the "Profiles" button in the top navigation. Once saved, you can chat with them or switch accounts!';
    }
    return 'Thank you for messaging WhatsApp Support. All messages are encrypted end-to-end. Have a great day!';
  }

  // Work Colleague or user-added profiles
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hey! Good to connect with you on WhatsApp.`;
  }
  if (lower.includes('how are') || lower.includes('how r')) {
    return 'I am doing well, thank you! Working on our shared project.';
  }
  if (lower.includes('call') || lower.includes('meeting')) {
    return 'Sounds good! You can start a voice or video call anytime by tapping the phone/video icon in the header.';
  }
  if (lower.includes('file') || lower.includes('document')) {
    return 'Received! I will review the file and get back to you shortly.';
  }

  const genericProfessionalReplies = [
    'Got it, thanks for confirming! 👍',
    'Understood, I am looking into this now.',
    'Sounds like a good plan. Let’s proceed! 🚀',
    'Noted! I will update our notes.',
    'Great, thanks for the update!',
  ];
  return genericProfessionalReplies[
    Math.floor(Math.random() * genericProfessionalReplies.length)
  ];
}
