import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../lib/db';
import { createAuthCookie } from '../../../../lib/api-utils';
import User from '../../../../models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: StatusCodes.CONFLICT }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const response = NextResponse.json(
      { message: 'Registered successfully', user: { id: user._id, email: user.email, name: user.name } },
      { status: StatusCodes.CREATED }
    );

    return await createAuthCookie(response, { id: user._id.toString(), email: user.email, name: user.name });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}