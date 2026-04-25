import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { connectDB } from '../../../../../lib/db';
import { getSession, unauthorized } from '../../../../../lib/api-utils';
import { getCommentsByPost, createComment } from '../../../../../services/comments';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const session = await getSession();
    if (!session) return unauthorized();

    await connectDB();
    const comments = await getCommentsByPost(id);
    return NextResponse.json(comments, { status: StatusCodes.OK });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const session = await getSession();
    if (!session) return unauthorized();

    await connectDB();
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { message: 'Content is required' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const comment = await createComment(id, session.id as string, content);
    return NextResponse.json(comment, { status: StatusCodes.CREATED });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}