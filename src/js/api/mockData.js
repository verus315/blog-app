// Mock data for development purposes
export const users = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$qqK4OEOypr7tUJmB6Wb5E.QyV5Kt59u9V7K98rZQzE/g/E.7Ktzyu', // 'admin123'
    role: 'admin',
    createdAt: '2025-01-01T00:00:00.000Z',
    avatar: null,
    isActive: true,
    posts: ['1', '4']
  },
  {
    id: '2',
    username: 'moderator',
    email: 'mod@example.com',
    password: '$2a$10$3I2nWCjA3nUz.5XK7YoW6OzfmcwdRxQxwPsG5S2BH3UAm0HVNxdJq', // 'moderator123'
    role: 'moderator',
    createdAt: '2025-01-10T00:00:00.000Z',
    avatar: null,
    isActive: true,
    posts: ['2']
  },
  {
    id: '3',
    username: 'user',
    email: 'user@example.com',
    password: '$2a$10$rVYCmhMG0MjuOlPzKk/Ns.JGJjpSuKHv9FQbajLyKKwjDn05MNXRG', // 'user123'
    role: 'user',
    createdAt: '2025-01-15T00:00:00.000Z',
    avatar: null,
    isActive: true,
    posts: ['3', '5']
  }
];

export const posts = [
  {
    id: '1',
    author: {
      id: '1',
      username: 'admin',
      avatar: null
    },
    content: 'Welcome to our Social Blog platform! This is a space for sharing ideas, connecting with others, and building a community. Feel free to post, comment, and engage with content that interests you.',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    createdAt: '2025-08-01T10:00:00.000Z',
    likes: ['2', '3'],
    comments: [
      {
        id: '1',
        author: {
          id: '2',
          username: 'moderator',
          avatar: null
        },
        content: 'Great to be here! Looking forward to moderating interesting discussions.',
        createdAt: '2025-08-01T10:05:00.000Z',
        likes: ['1'],
        replies: [
          {
            id: '3',
            author: {
              id: '1',
              username: 'admin',
              avatar: null
            },
            content: 'Thanks for your help with moderation!',
            createdAt: '2025-08-01T10:10:00.000Z',
            likes: ['2']
          }
        ]
      }
    ]
  },
  {
    id: '2',
    author: {
      id: '2',
      username: 'moderator',
      avatar: null
    },
    content: 'Here are some guidelines for posting: be respectful, avoid spam, and contribute meaningfully to discussions. If you have any questions or concerns, feel free to reach out to the moderation team.',
    image: null,
    createdAt: '2025-08-01T11:00:00.000Z',
    likes: ['1', '3'],
    comments: []
  },
  {
    id: '3',
    author: {
      id: '3',
      username: 'user',
      avatar: null
    },
    content: 'Just joined this platform and excited to connect with everyone! I\'m passionate about technology, photography, and travel. What are your interests?',
    image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
    createdAt: '2025-08-01T12:00:00.000Z',
    likes: ['1'],
    comments: [
      {
        id: '2',
        author: {
          id: '1',
          username: 'admin',
          avatar: null
        },
        content: 'Welcome to the community! That\'s a great photo.',
        createdAt: '2025-08-01T12:05:00.000Z',
        likes: ['3'],
        replies: []
      }
    ]
  },
  {
    id: '4',
    author: {
      id: '1',
      username: 'admin',
      avatar: null
    },
    content: 'Did you know? Regular participation in online communities can help build valuable connections and expose you to diverse perspectives. What has been your experience with online communities?',
    image: 'https://images.pexels.com/photos/7562313/pexels-photo-7562313.jpeg',
    createdAt: '2025-08-02T09:00:00.000Z',
    likes: [],
    comments: []
  },
  {
    id: '5',
    author: {
      id: '3',
      username: 'user',
      avatar: null
    },
    content: 'Check out this amazing sunset I captured yesterday! Nature has a way of creating the most beautiful art.',
    image: 'https://images.pexels.com/photos/127673/pexels-photo-127673.jpeg',
    createdAt: '2025-08-02T18:00:00.000Z',
    likes: ['1', '2'],
    comments: []
  }
];

export const reports = [
  {
    id: '1',
    contentType: 'post',
    contentId: '5',
    reason: 'inappropriate',
    details: 'This post contains misleading information.',
    reportedBy: {
      id: '2',
      username: 'moderator',
      avatar: null
    },
    createdAt: '2025-08-03T10:05:00.000Z',
    status: 'pending'
  },
  {
    id: '2',
    contentType: 'comment',
    contentId: '2',
    reason: 'harassment',
    details: 'This comment is targeting me personally.',
    reportedBy: {
      id: '3',
      username: 'user',
      avatar: null
    },
    createdAt: '2025-08-03T11:15:00.000Z',
    status: 'pending'
  }
];