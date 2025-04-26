import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// First create a connection without specifying the database
const initialConnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'verus',  // Empty password for XAMPP default configuration
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create the database first
async function createDatabase() {
  try {
    console.log('Attempting to create database...');
    const connection = await initialConnection.getConnection();
    await connection.query('CREATE DATABASE IF NOT EXISTS social_blog');
    console.log('Database created or already exists');
    connection.release();
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
}

// Then create a pool for the specific database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'verus',  // Empty password for XAMPP default configuration
  database: 'social_blog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database tables
async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // First create the database
    await createDatabase();
    
    // Then initialize tables
    const connection = await pool.getConnection();
    console.log('Connected to database, creating tables...');
    
    // Users table (no foreign key dependencies)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'moderator', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        avatar_url VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE
      )
    `);
    console.log('Users table created or already exists');
    
    // Posts table (depends on users)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(36) PRIMARY KEY,
        author_id VARCHAR(36) NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Posts table created or already exists');
    
    // Comments table (depends on users and posts)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(36) PRIMARY KEY,
        post_id VARCHAR(36) NOT NULL,
        author_id VARCHAR(36) NOT NULL,
        content TEXT NOT NULL,
        parent_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
      )
    `);
    console.log('Comments table created or already exists');
    
    // Likes table (depends on users, posts, and comments)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS likes (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        post_id VARCHAR(36),
        comment_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
        UNIQUE KEY unique_like (user_id, post_id, comment_id),
        CHECK (
          (post_id IS NOT NULL AND comment_id IS NULL) OR 
          (post_id IS NULL AND comment_id IS NOT NULL)
        )
      )
    `);
    console.log('Likes table created or already exists');
    
    // Reports table (depends on users, posts, and comments)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id VARCHAR(36) PRIMARY KEY,
        content_type ENUM('post', 'comment') NOT NULL,
        content_id VARCHAR(36) NOT NULL,
        reporter_id VARCHAR(36) NOT NULL,
        reason VARCHAR(255) NOT NULL,
        details TEXT,
        status ENUM('pending', 'resolved', 'dismissed') DEFAULT 'pending',
        resolution TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP NULL DEFAULT NULL,
        FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Reports table created or already exists');
    
    // Create default admin user if not exists
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.execute(`
      INSERT IGNORE INTO users (id, username, email, password, role)
      VALUES (UUID(), 'admin', 'admin@example.com', ?, 'admin')
    `, [hashedPassword]);
    console.log('Default admin user created or already exists');
    
    connection.release();
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export { pool, initializeDatabase };