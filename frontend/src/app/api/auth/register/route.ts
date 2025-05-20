import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password, password_confirmation } = await req.json();

  if (!username || !password || password !== password_confirmation) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // Simulate registration logic
  return NextResponse.json({ message: 'User registered successfully' });
}