# TarinaSpace

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
  database: 'TarinaSpace'
});
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Start the backend server:
```bash
npm start
```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000


## Browser Support

This application supports all modern browsers, for example:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)


## Acknowledgments

- Bootstrap 5 for UI components
- Font Awesome for icons
- Google Fonts for typography

## Support

For support, email support@TarinaSpace.com or create an issue in the repository. 
