#!/usr/bin/env node

const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function askPassword(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    
    process.stdin.on('data', function(char) {
      char = char + '';
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function createAdmin() {
  try {
    console.log('🔧 Admin User Creation Script');
    console.log('=============================\n');
    
    // Get user input
    const email = await askQuestion('Enter admin email: ');
    const name = await askQuestion('Enter admin name: ');
    const password = await askPassword('Enter admin password: ');
    
    if (!email || !name || !password) {
      console.log('❌ All fields are required!');
      process.exit(1);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format!');
      process.exit(1);
    }
    
    // Hash the password
    console.log('\n🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('⚠️  User already exists. Updating to admin...');
      
      // Update existing user to admin
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          name,
          isActive: true
        }
      });
      
      console.log('✅ Admin user updated successfully!');
      console.log('📧 Email:', updatedUser.email);
      console.log('👤 Name:', updatedUser.name);
      console.log('🔑 Role:', updatedUser.role);
    } else {
      // Create new admin user
      console.log('👤 Creating new admin user...');
      
      const adminUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'ADMIN',
          isActive: true
        }
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', adminUser.email);
      console.log('👤 Name:', adminUser.name);
      console.log('🔑 Role:', adminUser.role);
    }
    
    console.log('\n🚀 Admin Panel Access:');
    console.log('URL: http://localhost:3000/admin');
    console.log('Email:', email);
    console.log('Password: [hidden for security]');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    
    if (error.code === 'P2002') {
      console.log('💡 Hint: This email is already registered. Use a different email or update the existing user.');
    }
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Handle command line arguments for quick creation
async function quickCreate() {
  const args = process.argv.slice(2);
  
  if (args.length >= 3 && args[0] === '--quick') {
    const [, email, name, password] = args;
    
    try {
      console.log('🚀 Quick admin creation...');
      
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        const updatedUser = await prisma.user.update({
          where: { email },
          data: {
            password: hashedPassword,
            role: 'ADMIN',
            name,
            isActive: true
          }
        });
        console.log('✅ Admin user updated!');
      } else {
        const adminUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role: 'ADMIN',
            isActive: true
          }
        });
        console.log('✅ Admin user created!');
      }
      
      console.log('📧 Email:', email);
      console.log('🔑 Role: ADMIN');
      console.log('🚀 Login at: http://localhost:3000/admin');
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    } finally {
      await prisma.$disconnect();
    }
  } else {
    // Interactive mode
    await createAdmin();
  }
}

// Show usage if help requested
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔧 Admin User Creation Script
=============================

Usage:
  Interactive mode:
    node scripts/create-admin.js

  Quick mode:
    node scripts/create-admin.js --quick <email> <name> <password>

Examples:
  node scripts/create-admin.js
  node scripts/create-admin.js --quick admin@example.com "Admin User" "password123"

Options:
  --help, -h    Show this help message
  --quick       Quick creation mode with command line arguments
`);
  process.exit(0);
}

// Run the script
quickCreate();
