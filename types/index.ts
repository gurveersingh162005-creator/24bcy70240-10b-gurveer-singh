// This file exports TypeScript types and interfaces used throughout the application.

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Post {
    id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface PaginatedPosts {
    posts: Post[];
    total: number;
    page: number;
    limit: number;
}