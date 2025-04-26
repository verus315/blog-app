import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, initializeDatabase } from './db.js';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // or whatever your frontend URL is
  credentials: true
}));
const PORT = process.env.PORT || 3000;

// Static file middleware configuration
const publicDir = path.join(__dirname, '../public');
const srcDir = path.join(__dirname, '../src');
const uploadsDir = path.join(publicDir, 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Upload destination:', uploadsDir);
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creating upload directory:', uploadsDir);
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    console.log('Original file:', file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('Filtering file:', file);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      console.log('File type allowed:', file.mimetype);
      cb(null, true);
    } else {
      console.log('File type not allowed:', file.mimetype);
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to convert file path to URL
function getFileUrl(filename) {
  if (!filename) return null;
  return `/uploads/${filename}`;
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploads directory first (for image access)
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path) => {
    // Set proper content type for images
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    }
  }
}));

// All API routes should be defined here, BEFORE the general static file middleware
// JWT secret key
const JWT_SECRET = 'your-secret-key';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  console.log('Authenticating request...');
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    console.log('User authenticated:', user);
    req.user = user;
    next();
  });
}

// Admin middleware to check if user is admin
function authenticateAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  });
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user exists
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUser.length) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    await connection.execute(
      'INSERT INTO users (id, username, email, password) VALUES (UUID(), ?, ?, ?)',
      [username, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

app.post('/api/auth/login', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    const user = users[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Send response (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Logged in successfully',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// Post routes
app.get('/api/posts', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    console.log('Attempting to fetch posts...');
    const [posts] = await connection.execute(`
      SELECT 
        p.*,
        u.username as author_username,
        u.avatar_url as author_avatar,
        COUNT(DISTINCT CASE WHEN l.post_id IS NOT NULL THEN l.id END) as likes_count,
        COUNT(DISTINCT c.id) as comments_count,
        GROUP_CONCAT(DISTINCT l.user_id) as likes
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    
    // Process posts to format likes as an array
    const formattedPosts = posts.map(post => ({
      ...post,
      likes: post.likes ? post.likes.split(',').filter(id => id) : [],
      author: {
        username: post.author_username,
        avatar: post.author_avatar
      }
    }));
    
    // Get comments for each post
    for (let post of formattedPosts) {
      const [comments] = await connection.execute(`
        SELECT 
          c.*,
          u.username as author_username,
          u.avatar_url as author_avatar,
          COUNT(DISTINCT CASE WHEN l.comment_id IS NOT NULL THEN l.id END) as likes_count,
          GROUP_CONCAT(DISTINCT l.user_id) as likes
        FROM comments c
        JOIN users u ON c.author_id = u.id
        LEFT JOIN likes l ON c.id = l.comment_id
        WHERE c.post_id = ? AND c.parent_id IS NULL
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `, [post.id]);
      
      // Process comments to format likes as an array
      const formattedComments = comments.map(comment => ({
        ...comment,
        likes: comment.likes ? comment.likes.split(',').filter(id => id) : [],
        author: {
          username: comment.author_username,
          avatar: comment.author_avatar
        }
      }));
      
      // Get replies for each comment
      for (let comment of formattedComments) {
        const [replies] = await connection.execute(`
          SELECT 
            c.*,
            u.username as author_username,
            u.avatar_url as author_avatar,
            COUNT(DISTINCT CASE WHEN l.comment_id IS NOT NULL THEN l.id END) as likes_count,
            GROUP_CONCAT(DISTINCT l.user_id) as likes
          FROM comments c
          JOIN users u ON c.author_id = u.id
          LEFT JOIN likes l ON c.id = l.comment_id
          WHERE c.parent_id = ?
          GROUP BY c.id
          ORDER BY c.created_at ASC
        `, [comment.id]);
        
        // Process replies to format likes as an array
        comment.replies = replies.map(reply => ({
          ...reply,
          likes: reply.likes ? reply.likes.split(',').filter(id => id) : [],
          author: {
            username: reply.author_username,
            avatar: reply.author_avatar
          }
        }));
      }
      
      post.comments = formattedComments;
    }
    
    res.json(formattedPosts);
  } catch (error) {
    console.error('Get posts error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch posts', 
      error: error.message,
      stack: error.stack
    });
  } finally {
    connection.release();
  }
});

// Get user's posts
app.get('/api/posts/user', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    console.log('Fetching posts for user:', req.user.id);
    const [posts] = await connection.execute(`
      SELECT 
        p.*,
        u.username as author_username,
        u.avatar_url as author_avatar,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count,
        GROUP_CONCAT(DISTINCT l.user_id) as likes
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE p.author_id = ?
      GROUP BY p.id, u.username, u.avatar_url
      ORDER BY p.created_at DESC
    `, [req.user.id]);

    // Process posts to format likes as an array
    const formattedPosts = posts.map(post => ({
      ...post,
      likes: post.likes ? post.likes.split(',').filter(id => id) : [],
      author: {
        id: post.author_id,
        username: post.author_username,
        avatar: post.author_avatar
      }
    }));

    // Get comments for each post
    for (let post of formattedPosts) {
      const [comments] = await connection.execute(`
        SELECT 
          c.*,
          u.username as author_username,
          u.avatar_url as author_avatar,
          COUNT(DISTINCT l.id) as likes_count,
          GROUP_CONCAT(DISTINCT l.user_id) as likes
        FROM comments c
        JOIN users u ON c.author_id = u.id
        LEFT JOIN likes l ON c.id = l.comment_id
        WHERE c.post_id = ? AND c.parent_id IS NULL
        GROUP BY c.id
        ORDER BY c.created_at DESC
      `, [post.id]);

      // Process comments
      const formattedComments = comments.map(comment => ({
        ...comment,
        likes: comment.likes ? comment.likes.split(',').filter(id => id) : [],
        author: {
          username: comment.author_username,
          avatar: comment.author_avatar
        }
      }));

      // Get replies for each comment
      for (let comment of formattedComments) {
        const [replies] = await connection.execute(`
          SELECT 
            c.*,
            u.username as author_username,
            u.avatar_url as author_avatar,
            COUNT(DISTINCT l.id) as likes_count,
            GROUP_CONCAT(DISTINCT l.user_id) as likes
          FROM comments c
          JOIN users u ON c.author_id = u.id
          LEFT JOIN likes l ON c.id = l.comment_id
          WHERE c.parent_id = ?
          GROUP BY c.id
          ORDER BY c.created_at ASC
        `, [comment.id]);

        // Process replies
        comment.replies = replies.map(reply => ({
          ...reply,
          likes: reply.likes ? reply.likes.split(',').filter(id => id) : [],
          author: {
            username: reply.author_username,
            avatar: reply.author_avatar
          }
        }));
      }

      post.comments = formattedComments;
    }

    res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user posts', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    connection.release();
  }
});

// Helper function to download image from URL
async function downloadImage(url) {
  try {
    console.log('Downloading image from URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('URL does not point to an image');
    }
    
    const extension = contentType.split('/')[1] || 'jpg';
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
    const filePath = path.join(uploadsDir, fileName);
    
    const buffer = await response.arrayBuffer();
    await fs.promises.writeFile(filePath, Buffer.from(buffer));
    
    console.log('Image downloaded successfully:', fileName);
    return fileName;
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
}

// Post creation endpoint with improved error handling
app.post('/api/posts', authenticateToken, upload.single('image'), async (req, res) => {
  console.log('POST /api/posts - Starting request handling');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);
  console.log('Authenticated user:', req.user);
  console.log('Upload directory exists:', fs.existsSync(uploadsDir));
  console.log('Upload directory contents:', fs.readdirSync(uploadsDir));

  const connection = await pool.getConnection();
  try {
    console.log('Creating new post:', { body: req.body, file: req.file });
    const { content } = req.body;
    const userId = req.user.id;
    let imageUrl = null;

    // Handle file upload if present
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      console.log('Image uploaded:', imageUrl);
      // Verify file exists
      const fullPath = path.join(uploadsDir, req.file.filename);
      console.log('Full image path:', fullPath);
      console.log('File exists:', fs.existsSync(fullPath));
    }

    // Validate that either content or image is provided
    if (!content && !imageUrl) {
      console.log('Validation failed: No content or image provided');
      return res.status(400).json({ message: 'Post must contain either text content or an image' });
    }

    // Create post with UUID
    const postId = uuidv4();
    console.log('Creating post with ID:', postId);

    await connection.execute(
      'INSERT INTO posts (id, author_id, content, image_url, created_at) VALUES (?, ?, ?, ?, NOW())',
      [postId, userId, content || '', imageUrl]
    );

    console.log('Post inserted into database');

    // Fetch the created post with user info
    const [[post]] = await connection.execute(`
      SELECT 
        p.*,
        u.username as author_username,
        u.avatar_url as author_avatar,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count,
        GROUP_CONCAT(DISTINCT l.user_id) as likes
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE p.id = ?
      GROUP BY p.id, u.username, u.avatar_url
    `, [postId]);

    if (!post) {
      console.error('Failed to fetch created post');
      throw new Error('Failed to fetch created post');
    }

    console.log('Post fetched from database:', post);

    // Format the response
    const formattedPost = {
      id: post.id,
      content: post.content,
      image_url: post.image_url,
      created_at: post.created_at,
      author: {
        id: post.author_id,
        username: post.author_username,
        avatar: post.author_avatar
      },
      likes: post.likes ? post.likes.split(',').filter(Boolean) : [],
      likes_count: post.likes_count || 0,
      comments_count: post.comments_count || 0,
      comments: []
    };
    
    console.log('Sending formatted response:', formattedPost);
    res.status(201).json(formattedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    console.error('Error stack:', error.stack);
    // If there was a file upload, clean it up on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Cleaned up uploaded file after error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }
    res.status(500).json({ 
      message: 'Failed to create post', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    connection.release();
    console.log('POST /api/posts - Request handling completed');
  }
});

app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const postId = req.params.id;
    
    // Check if user has already liked the post
    const [existingLike] = await connection.execute(
      'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
      [req.user.id, postId]
    );
    
    if (existingLike.length > 0) {
      // Unlike
      await connection.execute(
        'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
        [req.user.id, postId]
      );
    } else {
      // Like
      await connection.execute(
        'INSERT INTO likes (id, user_id, post_id) VALUES (UUID(), ?, ?)',
        [req.user.id, postId]
      );
    }
    
    // Get updated post
    const [posts] = await connection.execute(`
      SELECT 
        p.*,
        u.username as author_username,
        u.avatar_url as author_avatar,
        COUNT(DISTINCT l.id) as likes_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [postId]);
    
    res.json(posts[0]);
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

app.post('/api/posts/:id/comment', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { content, parentId } = req.body;
    const postId = req.params.id;
    
    // Validate input
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    // Create comment
    await connection.execute(
      'INSERT INTO comments (id, post_id, author_id, content, parent_id) VALUES (UUID(), ?, ?, ?, ?)',
      [postId, req.user.id, content, parentId || null]
    );
    
    // Get updated post with comments
    const [posts] = await connection.execute(`
      SELECT 
        p.*,
        u.username as author_username,
        u.avatar_url as author_avatar,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [postId]);
    
    const post = posts[0];
    
    // Get comments
    const [comments] = await connection.execute(`
      SELECT 
        c.*,
        u.username as author_username,
        u.avatar_url as author_avatar,
        COUNT(DISTINCT l.id) as likes_count
      FROM comments c
      JOIN users u ON c.author_id = u.id
      LEFT JOIN likes l ON c.id = l.comment_id
      WHERE c.post_id = ? AND c.parent_id IS NULL
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [postId]);
    
    // Get replies
    for (let comment of comments) {
      const [replies] = await connection.execute(`
        SELECT 
          c.*,
          u.username as author_username,
          u.avatar_url as author_avatar,
          COUNT(DISTINCT l.id) as likes_count
        FROM comments c
        JOIN users u ON c.author_id = u.id
        LEFT JOIN likes l ON c.id = l.comment_id
        WHERE c.parent_id = ?
        GROUP BY c.id
        ORDER BY c.created_at ASC
      `, [comment.id]);
      
      comment.replies = replies;
    }
    
    post.comments = comments;
    res.json(post);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

app.post('/api/report', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    console.log('Creating new report:', req.body);
    const { contentType, contentId, reason, details } = req.body;
    
    // Validate input
    if (!contentType || !contentId || !reason) {
      return res.status(400).json({ message: 'contentType, contentId, and reason are required' });
    }

    // Validate content type
    if (!['post', 'comment'].includes(contentType)) {
      return res.status(400).json({ message: 'Invalid content type. Must be "post" or "comment"' });
    }

    // Verify the reported content exists
    const [content] = await connection.execute(
      contentType === 'post' 
        ? 'SELECT id FROM posts WHERE id = ?' 
        : 'SELECT id FROM comments WHERE id = ?',
      [contentId]
    );

    if (!content.length) {
      return res.status(404).json({ message: `${contentType} not found` });
    }

    // Create report with UUID
    const reportId = uuidv4();
    await connection.execute(`
      INSERT INTO reports (
        id, 
        content_type, 
        content_id, 
        reporter_id, 
        reason, 
        details, 
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
    `, [reportId, contentType, contentId, req.user.id, reason, details || null]);
    
    // Fetch the created report
    const [[report]] = await connection.execute(`
      SELECT 
        r.*,
        u.username as reporter_username
      FROM reports r
      JOIN users u ON r.reporter_id = u.id
      WHERE r.id = ?
    `, [reportId]);
    
    console.log('Report created successfully:', report);
    res.status(201).json({
      message: 'Report submitted successfully',
      report: {
        id: report.id,
        content_type: report.content_type,
        content_id: report.content_id,
        reason: report.reason,
        details: report.details,
        status: report.status,
        created_at: report.created_at,
        reporter: {
          username: report.reporter_username
        }
      }
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ 
      message: 'Failed to create report', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    connection.release();
  }
});

// Admin routes
app.get('/api/admin/posts', authenticateAdmin, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [posts] = await connection.execute(`
      SELECT 
        p.*,
        u.username as author_username,
        u.avatar_url as author_avatar,
        COUNT(DISTINCT l.id) as likes_count,
        COUNT(DISTINCT c.id) as comments_count,
        COUNT(DISTINCT r.id) as reports_count,
        GROUP_CONCAT(DISTINCT l.user_id) as likes
      FROM posts p
      JOIN users u ON p.author_id = u.id
      LEFT JOIN likes l ON p.id = l.post_id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN reports r ON p.id = r.content_id AND r.content_type = 'post'
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    // Format posts
    const formattedPosts = posts.map(post => ({
      ...post,
      likes: post.likes ? post.likes.split(',').filter(Boolean) : [],
      author: {
        username: post.author_username,
        avatar: post.author_avatar
      },
      comments: [],
      reports_count: post.reports_count || 0
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [users] = await connection.execute(`
      SELECT 
        u.*,
        COUNT(DISTINCT p.id) as posts_count,
        COUNT(DISTINCT c.id) as comments_count
      FROM users u
      LEFT JOIN posts p ON u.id = p.author_id
      LEFT JOIN comments c ON u.id = c.author_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    // Remove sensitive information
    const safeUsers = users.map(({ password, ...user }) => ({
      ...user,
      posts_count: user.posts_count || 0,
      comments_count: user.comments_count || 0
    }));

    res.json(safeUsers);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  } finally {
    connection.release();
  }
});

app.get('/api/admin/reports', authenticateAdmin, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    console.log('Fetching admin reports...');
    
    // First, verify the reports table exists
    const [tables] = await connection.query('SHOW TABLES LIKE "reports"');
    if (tables.length === 0) {
      console.error('Reports table does not exist');
      throw new Error('Reports table not found');
    }

    // Describe the reports table to log its structure
    const [columns] = await connection.query('DESCRIBE reports');
    console.log('Reports table structure:', columns);

    const [reports] = await connection.execute(`
      SELECT 
        r.*,
        u.username as reporter_username,
        u.avatar_url as reporter_avatar,
        CASE 
          WHEN r.content_type = 'post' THEN p.content
          WHEN r.content_type = 'comment' THEN c.content
        END as content_text,
        CASE 
          WHEN r.content_type = 'post' THEN p.author_id
          WHEN r.content_type = 'comment' THEN c.author_id
        END as content_author_id,
        au.username as content_author_username
      FROM reports r
      JOIN users u ON r.reporter_id = u.id
      LEFT JOIN posts p ON r.content_type = 'post' AND r.content_id = p.id
      LEFT JOIN comments c ON r.content_type = 'comment' AND r.content_id = c.id
      LEFT JOIN users au ON au.id = CASE 
        WHEN r.content_type = 'post' THEN p.author_id
        WHEN r.content_type = 'comment' THEN c.author_id
      END
      ORDER BY r.created_at DESC
    `);

    console.log('Reports fetched:', reports.length);

    // Format reports with detailed error handling
    const formattedReports = reports.map(report => {
      try {
        return {
          id: report.id,
          content_type: report.content_type,
          content_id: report.content_id,
          reason: report.reason,
          details: report.details,
          status: report.status,
          created_at: report.created_at,
          resolved_at: report.resolved_at,
          resolution: report.resolution,
          reporter: {
            username: report.reporter_username,
            avatar: report.reporter_avatar
          },
          content: {
            text: report.content_text || '[Content not available]',
            type: report.content_type,
            author: report.content_author_username ? {
              username: report.content_author_username
            } : null
          }
        };
      } catch (error) {
        console.error('Error formatting report:', error, report);
        return null;
      }
    }).filter(Boolean); // Remove any null entries from formatting errors

    console.log('Formatted reports:', formattedReports.length);
    res.json(formattedReports);
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({ 
      message: 'Failed to fetch reports', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    connection.release();
  }
});

app.put('/api/admin/reports/:id', authenticateToken, async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // Check if user is admin or moderator
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const reportId = req.params.id;
    const { action, notes } = req.body;
    
    // Update report
    await connection.execute(`
      UPDATE reports 
      SET status = 'resolved',
          resolved_by = ?,
          resolved_at = CURRENT_TIMESTAMP,
          resolution = ?,
          notes = ?
      WHERE id = ?
    `, [req.user.id, action, notes || '', reportId]);
    
    res.json({ message: 'Report handled successfully' });
  } catch (error) {
    console.error('Handle report error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    connection.release();
  }
});

// Static file middleware should be AFTER all API routes
app.use(express.static(publicDir, {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Serve source files for development
app.use('/src', express.static(srcDir, {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// This should be the LAST middleware
app.get('*', (req, res) => {
  // Don't redirect API requests
  if (req.url.startsWith('/api/')) {
    res.status(404).json({ message: 'API endpoint not found' });
    return;
  }
  
  // Don't redirect .js files to index.html
  if (req.url.endsWith('.js')) {
    res.status(404).send('Not found');
    return;
  }
  
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Server startup error:', err);
});