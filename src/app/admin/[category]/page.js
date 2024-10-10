'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../utils/auth';
import { fetchResource, deleteResource, updateResource } from '../../utils/api';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function ManageCategoryPage({ params }) {
    const [items, setItems] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();
    const category = params.category;

    useEffect(() => {
        console.log("Category:", category); // Log the category
        if (!isAuthenticated()) {
            console.log("Not authenticated, redirecting to login");
            router.push('/login');
        } else {
            console.log("Authenticated, loading items");
            setIsAuth(true);
            loadItems();
        }
    }, [router, category]);

    const loadItems = async () => {
        try {
            console.log(`Fetching ${category}...`);
            const data = await fetchResource(category);
            console.log(`Fetched ${category}:`, data);
            setItems(data);
        } catch (error) {
            console.error(`Failed to fetch ${category}:`, error);
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log(`Deleting ${category} with id:`, id); // Add this log
            await deleteResource(category, id);
            loadItems();
        } catch (error) {
            console.error(`Failed to delete ${category}:`, error);
        }
    };

    const handleEdit = (id) => {
        console.log(`Editing ${category} with id:`, id);
        router.push(`/admin/${category}/edit/${id}`);
    };

    if (!isAuth) {
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Manage {category}</h1>
            <Link href="/admin" className="text-blue-500 hover:underline mb-4 block">
                Back to Admin Dashboard
            </Link>
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.ID} className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-2xl font-semibold">{item.title || item.name}</h2>
                        <div className="prose mt-2">
                            <ReactMarkdown>
                                {item.content || item.description}
                            </ReactMarkdown>
                        </div>
                        {item.url && (
                            <p className="mt-2">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    {item.url}
                                </a>
                            </p>
                        )}
                        <div className="mt-4 space-x-2">
                            <button
                                onClick={() => handleEdit(item.ID)}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}