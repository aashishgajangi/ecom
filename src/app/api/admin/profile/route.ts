import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

// Simple function to execute SQL queries directly
async function executeQuery(query: string, values?: unknown[]) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    await client.connect();
    const result = await client.query(query, values);
    return result.rows;
  } finally {
    await client.end();
  }
}

export async function GET() {
  try {
    // Get the admin user directly from database
    const users = await executeQuery('SELECT id, email, name, role, "createdAt", "updatedAt" FROM users WHERE role = $1', ['ADMIN']);
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Update the admin user directly in database
    await executeQuery(
      'UPDATE users SET name = $1, email = $2, "updatedAt" = NOW() WHERE id = $3',
      [name, email, 'admin_001']
    );

    // Fetch the updated user
    const updatedUsers = await executeQuery('SELECT id, email, name, role, "createdAt", "updatedAt" FROM users WHERE id = $1', ['admin_001']);
    
    if (updatedUsers.length === 0) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 404 });
    }

    return NextResponse.json(updatedUsers[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
