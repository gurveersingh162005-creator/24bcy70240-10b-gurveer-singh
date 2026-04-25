import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { connectDB } from '../../../../lib/db';
import { getSession, unauthorized } from '../../../../lib/api-utils';
import { getPostById, deletePost } from '../../../../services/posts';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const session = await getSession();
    if (!session) return unauthorized();

    await connectDB();
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    return NextResponse.json(post, { status: StatusCodes.OK });

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const session = await getSession();
    if (!session) return unauthorized();

    await connectDB();
    const deleted = await deletePost(id, session.id as string);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Post not found or unauthorized' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    return NextResponse.json(
      { message: 'Post deleted' },
      { status: StatusCodes.OK }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}