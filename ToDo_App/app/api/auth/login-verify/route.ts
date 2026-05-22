import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'TODO: implement WebAuthn login verification' }, { status: 501 });
}
