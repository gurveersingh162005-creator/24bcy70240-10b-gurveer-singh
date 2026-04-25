import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { connectDB } from '../../../lib/db';
import { getSession, unauthorized } from '../../../lib/api-utils';
import { paginatePosts, getAllPostsExcluding, createPost } from '../../../services/posts';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    await connectDB();
    const page = Number(req.nextUrl.searchParams.get('page')) || 1;
    const result = await getAllPostsExcluding(session.id as string);

    return NextResponse.json(result, { status: StatusCodes.OK });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    await connectDB();
    const { title, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const post = await createPost(session.id as string, title, description);
    return NextResponse.json(post, { status: StatusCodes.CREATED });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}