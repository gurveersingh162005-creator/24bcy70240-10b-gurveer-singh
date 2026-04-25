import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { connectDB } from '../../../../lib/db';
import { getSession, unauthorized } from '../../../../lib/api-utils';
import Post from '../../../../models/Post';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    await connectDB();
    const page = Number(req.nextUrl.searchParams.get('page')) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ userId: session.id });

    return NextResponse.json(
      { posts, total, totalPages: Math.ceil(total / limit) },
      { status: StatusCodes.OK }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}