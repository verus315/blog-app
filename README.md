# SocialBlog

A modern social blogging platform built with vanilla JavaScript and Node.js. This project demonstrates how to build a full-featured social platform without using any frontend frameworks, relying solely on pure JavaScript, HTML, and CSS.

## Tech Stack

### Frontend
- ✨ Vanilla JavaScript (No frameworks)
- 🎨 HTML5 & CSS3
- 📱 Bootstrap 5 for responsive UI
- 🔄 Custom client-side routing
- 🎭 Font Awesome icons
- 📝 Custom event system
- 🌐 Fetch API for HTTP requests

### Backend
- 🚀 Node.js with Express
- 📦 MySQL database
- 🔑 JWT authentication
- 📁 Multer for file uploads
- 🔄 RESTful API architecture

## Features

- 🔐 User authentication (Login/Register)
- 👤 User profiles and dashboards
- 📝 Create, edit, and delete posts
- 🖼️ Image upload support
- 💬 Comments and replies
- ❤️ Like/unlike posts and comments
- 🚫 Content moderation and reporting
- 🌓 Light/Dark theme toggle
- 📱 Responsive design
- 👮 Role-based access (Admin, Moderator, User)

## Why Vanilla JS?

This project intentionally avoids frontend frameworks to demonstrate:
- 🎯 Pure JavaScript capabilities
- ⚡ Excellent performance without framework overhead
- 📚 Fundamental web development concepts
- 🔧 Custom routing and state management
- 🎨 DOM manipulation without virtual DOM
- 🔄 Event-driven architecture

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-blog
```

2. Install dependencies:
```bash
npm install
```

3. Create a MySQL database and configure the connection:
   - Open `server/db.js`
   - Update the database configuration with your credentials:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'socialblog'
});
```

4. Set up environment variables (optional):
   - Create a `.env` file in the root directory
   - Add your configuration:
```env
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```
This will start the Vite development server on port 5173.

2. Start the backend server:
```bash
npm start
```
This will start the Express server on port 3000.

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Project Structure

```
social-blog/
├── build/                  # Production build output
├── dist/                   # Distribution files
├── node_modules/          # Node.js dependencies
├── public/                # Static files
│   ├── uploads/          # User uploaded files
│   └── css/              # Public CSS files
├── server/               # Backend server code
│   ├── index.js         # Main server file
│   └── db.js           # Database configuration
├── src/                 # Frontend source code
│   ├── css/            # Stylesheets
│   └── js/             # JavaScript files
│       ├── api/        # API integration
│       ├── auth/       # Authentication
│       ├── components/ # UI components
│       ├── pages/      # Page components
│       └── utils/      # Utility functions
├── .gitignore          # Git ignore file
├── index.html          # Main HTML file
├── package.json        # Project dependencies
├── vite.config.js      # Vite configuration
└── README.md           # Project documentation
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout

### Posts
- GET `/api/posts` - Get all posts
- GET `/api/posts/:id` - Get specific post
- POST `/api/posts` - Create new post
- PUT `/api/posts/:id` - Update post
- DELETE `/api/posts/:id` - Delete post
- POST `/api/posts/:id/like` - Like/unlike post

### Comments
- GET `/api/posts/:id/comments` - Get post comments
- POST `/api/posts/:id/comments` - Add comment
- PUT `/api/comments/:id` - Update comment
- DELETE `/api/comments/:id` - Delete comment

### User
- GET `/api/posts/user` - Get user's posts
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update profile

## Development

### Project Organization

The frontend is organized using a component-based architecture despite not using a framework:
- Custom routing system in `src/js/main.js`
- Component-based structure in `src/js/components/`
- Page templates in `src/js/pages/`
- Utility functions in `src/js/utils/`
- API integration in `src/js/api/`

### Key JavaScript Features Used
- ES6+ Modules
- Custom Events
- Async/Await
- Template Literals
- DOM Manipulation
- Local Storage
- Fetch API
- Class-based Components

### Building for Production

1. Build the frontend:
```bash
npm run build
```

2. The production files will be in the `build` directory.

### Development Tools

- Vite for frontend development
- Express for backend API
- MySQL for database
- JWT for authentication
- Multer for file uploads
- Bootstrap 5 for UI components

## Browser Support

This application supports all modern browsers that can run ES6+ JavaScript:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap 5 for UI components
- Font Awesome for icons
- Google Fonts for typography

## Support

For support, email support@socialblog.com or create an issue in the repository. 