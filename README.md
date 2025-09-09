# Nisargalahari E-commerce Platform

A full-featured e-commerce platform built with Next.js, TypeScript, Prisma, and PostgreSQL. Features include product catalog, user management, shopping cart, admin panel, CMS, and blog functionality.

## Features

- 🛍️ **E-commerce**: Product catalog, shopping cart, order management
- 👤 **User Management**: Authentication, user profiles, role-based access
- 📱 **Admin Panel**: Product management, order tracking, user administration
- 📝 **CMS**: Dynamic page creation, content blocks, SEO optimization
- 📰 **Blog**: Article management, categories, publishing workflow
- 💾 **Backup System**: Database backup and restore functionality
- 🎨 **Modern UI**: Responsive design with Tailwind CSS

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

## Project Structure

```
ecom/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utility functions
│   └── generated/       # Generated Prisma client
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── backups/             # Database backup files
├── public/              # Static assets
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

## Admin Panel

Access the admin panel at `/admin` with admin credentials.

Features include:
- Product management
- Order tracking
- User administration
- Content management
- Database backups
- System settings

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

## Troubleshooting

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

### Logs and Debugging

- Check browser console for frontend errors
- View server logs in terminal
- Enable Prisma query logging in development

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
