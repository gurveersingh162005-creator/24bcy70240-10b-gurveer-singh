import React from 'react';

interface PostItemProps {
    title: string;
    description: string;
    authorName: string;
    createdAt: string;
}

const PostItem: React.FC<PostItemProps> = ({ title, description, authorName, createdAt }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-gray-600">{description}</p>
            <div className="mt-2 text-sm text-gray-500">
                <p>By: {authorName}</p>
                <p>{new Date(createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default PostItem;