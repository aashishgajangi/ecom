# Ecom E-commerce Platform

A sophisticated full-featured e-commerce platform built with Next.js 15, TypeScript, Prisma, and PostgreSQL. This platform combines powerful CMS capabilities with e-commerce functionality, featuring a comprehensive admin panel, visual content editors, and advanced media management.

## ✨ Current Features & Capabilities

### 🏪 **E-commerce Foundation**
- **Database Schema**: Complete e-commerce models (Users, Products, Orders, Cart, Categories)
- **Product Management**: Ready for product catalog implementation
- **Order Processing**: Database schema for order management and tracking
- **User System**: Customer and admin role-based authentication

### 🎨 **Advanced CMS & Content Management**
- **Visual Homepage Editor**: Live editing of hero sections, featured products, service areas
- **Page Management**: Create, edit, publish dynamic pages with structured content
- **Media Library**: Advanced drag-and-drop file management with image organization
- **SEO Tools**: Built-in SEO preview, meta tags, and search optimization
- **Content Blocks**: Reusable content components and templates

### 👨‍💼 **Comprehensive Admin Panel**
- **Dashboard**: Real-time statistics and content overview
- **Content Hub**: Centralized content management with visual editors
- **Media Management**: Professional media library with bulk operations
- **Backup System**: Database backup/restore with file management
- **Site Settings**: Header, footer, navigation, and company configuration

### 🛠️ **Technical Features**
- **Authentication**: NextAuth.js with secure session management
- **Database**: PostgreSQL with comprehensive Prisma schema
- **File Uploads**: Advanced media handling with file organization
- **Responsive Design**: Modern UI with Tailwind CSS and dark mode support
- **API Integration**: RESTful APIs for all platform functionality

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with credentials provider

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecom
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Install PostgreSQL (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### Start PostgreSQL Service
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Create Database and User
```bash
# Create database
sudo -u postgres createdb ecom

# Create user with password
sudo -u postgres psql -c "CREATE USER aashish WITH ENCRYPTED PASSWORD '2411';"

# Grant permissions
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ecom TO aashish;"
sudo -u postgres psql -d ecom -c "GRANT ALL ON SCHEMA public TO aashish;"
sudo -u postgres psql -d ecom -c "GRANT CREATE ON SCHEMA public TO aashish;"
sudo -u postgres psql -c "ALTER USER aashish CREATEDB;"
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://aashish:2411@localhost:5432/ecom?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-please-change-in-production"

# Optional: Add other environment variables as needed
# NODE_ENV="development"
```

### 5. Database Migration

Run Prisma migrations to create database tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create all necessary database tables
- Generate Prisma client
- Set up the database schema

### 6. Import Backup Data (Optional)

If you have existing backup data, you can import it:

```bash
# Navigate to backups directory
cd backups

# Import the most recent backup (replace filename as needed)
PGPASSWORD=2411 pg_restore -h localhost -U aashish -d ecom -v --data-only backup_2025-09-08T21-08-12-784Z.dump
```

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
ecom/
├── src/
│   ├── app/                          # Next.js 15 App Router
│   │   ├── admin/                    # Admin Panel
│   │   │   ├── dashboard/            # Admin Dashboard
│   │   │   ├── content/              # Content Management
│   │   │   │   ├── homepage/edit/    # Visual Homepage Editor
│   │   │   │   ├── media/            # Media Library
│   │   │   │   ├── pages/            # Page Management
│   │   │   │   ├── header/footer/    # Site Settings
│   │   │   │   └── ...               # Content Tools
│   │   │   ├── backup/               # Backup System
│   │   │   └── profile/              # Admin Profile
│   │   ├── api/                      # API Routes
│   │   │   ├── admin/                # Admin APIs
│   │   │   ├── auth/                 # Authentication
│   │   │   ├── pages/                # Page APIs
│   │   │   └── settings/             # Settings APIs
│   │   ├── [slug]/                   # Dynamic Pages
│   │   └── globals.css               # Global Styles
│   ├── components/                   # Reusable Components
│   │   ├── Hero.tsx                  # Homepage Hero
│   │   ├── HomepageEditor.tsx        # Visual Editor
│   │   ├── RichTextEditor.tsx        # Content Editor
│   │   ├── SEOPreview.tsx           # SEO Tools
│   │   └── ...                       # UI Components
│   ├── lib/                          # Utilities
│   │   ├── prisma.ts                 # Database Client
│   │   ├── auth.ts                   # Auth Configuration
│   │   └── db-utils.ts               # Database Utilities
│   └── generated/prisma/             # Generated Prisma Client
├── prisma/
│   ├── schema.prisma                 # Database Schema
│   └── migrations/                   # Database Migrations
├── backups/                          # Database Backups
├── public/uploads/                   # Media Files
└── ...config files
```

## Database Schema

The application includes comprehensive models for:
- **Users**: Customer and admin accounts
- **Products**: Catalog with categories and images
- **Orders**: Shopping cart and order management
- **Pages**: CMS with dynamic content
- **Blog**: Articles and categories
- **Media**: File upload management
- **Settings**: Site configuration

## 🎛️ Admin Panel Overview

Access the comprehensive admin panel at `/admin` with admin credentials.

### **Current Admin Features:**

#### 🏠 **Content Management Hub**
- **Visual Homepage Editor**: Real-time editing of hero sections, featured products, service areas
- **Page Management**: Create, edit, and publish dynamic pages with SEO optimization
- **Media Library**: Professional media management with drag-and-drop uploads
- **Site Settings**: Configure header, footer, navigation, and company information

#### 📊 **Dashboard & Analytics**
- **Real-time Statistics**: Page counts, published content, drafts, and backup status
- **System Monitoring**: Database health and system status overview
- **Quick Actions**: Direct access to all admin functions

#### 🛠️ **System Tools**
- **Database Backup**: Automated backup creation and restoration system
- **Content Cleanup**: Tools for managing and organizing content
- **Import/Export**: Data management and migration tools

#### 👤 **User Management**
- **Admin Profiles**: Profile management and password changes
- **Authentication**: Secure NextAuth.js session management
- **Role-based Access**: Admin and customer role separation

### **Admin Panel Routes:**
- `/admin` - Login page
- `/admin/dashboard` - Main dashboard
- `/admin/content` - Content management hub
- `/admin/content/homepage/edit` - Visual homepage editor
- `/admin/content/media` - Media library
- `/admin/content/pages` - Page management
- `/admin/backup` - Backup system
- `/admin/profile` - Profile settings

## Backup System

The application includes an automated backup system:

### Creating Backups
- Via Admin Panel: Navigate to `/admin/backup`
- Via API: `POST /api/admin/backup`
- Manual: `pg_dump -U aashish -d ecom -F c -b -v -f backup.dump`

### Restoring Backups
```bash
pg_restore -U aashish -d ecom -c -v backup_file.dump
```

## Production Deployment

### Environment Variables for Production

```bash
# Database (use production credentials)
DATABASE_URL="postgresql://username:password@host:port/database"

# NextAuth.js (use secure random string)
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="secure-random-string-for-production"

# Node Environment
NODE_ENV="production"
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Database Migration in Production

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 🚀 Current Development Status

### **🟢 FULLY IMPLEMENTED**
- ✅ **Authentication System**: Complete admin login with NextAuth.js
- ✅ **Content Management**: Advanced CMS with visual editors
- ✅ **Media Library**: Professional media management system
- ✅ **Admin Dashboard**: Comprehensive admin interface
- ✅ **Database Schema**: Complete e-commerce and CMS models
- ✅ **Backup System**: Database backup and restore functionality
- ✅ **Homepage Management**: Visual homepage editing with structured content
- ✅ **Page Management**: Dynamic page creation and publishing
- ✅ **SEO Tools**: Built-in SEO optimization and preview

### **🟡 READY FOR IMPLEMENTATION**
- 🔄 **Product Catalog**: Database schema ready, UI implementation pending
- 🔄 **Shopping Cart**: Models defined, frontend implementation needed
- 🔄 **Order Management**: Complete schema available, admin UI pending
- 🔄 **Blog System**: Database models ready, admin interface needed
- 🔄 **Customer Portal**: User models defined, frontend registration needed

### **🔵 PLANNED FEATURES**
- 🔮 **Payment Integration**: Stripe/PayPal integration
- 🔮 **Email Notifications**: Order confirmations and updates
- 🔮 **Inventory Management**: Stock tracking and alerts
- 🔮 **Analytics Dashboard**: Sales and performance metrics
- 🔮 **Multi-language Support**: Internationalization

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running: `sudo systemctl status postgresql`
   - Verify credentials in `.env` file
   - Ensure database and user exist

2. **Permission Denied Error**
   - Grant proper permissions to database user
   - Check file permissions for backup directory

3. **Prisma Client Error**
   - Regenerate client: `npx prisma generate`
   - Check database schema is up to date

4. **Port Already in Use**
   - Change port: `npm run dev -- -p 3001`
   - Kill existing process: `lsof -ti:3000 | xargs kill`

5. **Media Upload Issues**
   - Check `public/uploads/` directory permissions
   - Verify file size limits in configuration

### Logs and Debugging

- Check browser console for frontend errors
- View server logs in terminal
- Enable Prisma query logging in development
- Check admin dashboard for system status

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please check the documentation or create an issue in the repository.
