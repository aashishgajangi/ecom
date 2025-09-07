import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user exists with this email
    const users = await executeQuery(
      'SELECT id, email, name, role, password FROM users WHERE email = $1',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    
    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Return user data (in real implementation, you'd create a session/JWT)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
