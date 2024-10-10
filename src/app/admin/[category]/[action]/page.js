'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../../utils/auth';
import { createResource, updateResource, fetchResourceById } from '../../../utils/api';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function AddEditCategoryPage({ params }) {
    const [formData, setFormData] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();
    const { category, action, id } = params;
    const isEditing = action === 'edit';

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        } else {
            setIsAuth(true);
            if (isEditing) {
                loadItem();
            }
        }
    }, [router, category, action, id]);

    const loadItem = async () => {
        try {
            const data = await fetchResourceById(category, id);
            setFormData(data);
        } catch (error) {
            console.error(`Failed to fetch ${category}:`, error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContentChange = (value) => {
        if (category === 'skills') {
            setFormData({ ...formData, description: value });
        } else {
            setFormData({ ...formData, content: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let dataToSubmit = { ...formData };
            if (category === 'skills') {
                dataToSubmit = {
                    name: formData.title || formData.name,
                    description: formData.content || formData.description
                };
            }
            if (isEditing) {
                await updateResource(category, id, dataToSubmit);
            } else {
                await createResource(category, dataToSubmit);
            }
            router.push(`/admin/${category}/manage`);
        } catch (error) {
            console.error(`Failed to ${isEditing ? 'update' : 'create'} ${category}:`, error);
        }
    };

    if (!isAuth) {
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">{isEditing ? 'Edit' : 'Add'} {category}</h1>
            <Link href="/admin" className="text-blue-500 hover:underline mb-4 block">
                Back to Admin Dashboard
            </Link>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">{category === 'skills' ? 'Skill Name' : 'Title/Name'}:</label>
                    <input
                        type="text"
                        name={category === 'skills' ? 'name' : 'title'}
                        value={formData.title || formData.name || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">{category === 'skills' ? 'Skill Description' : 'Content/Description'}:</label>
                    <MDEditor
                        value={formData.content || formData.description || ''}
                        onChange={handleContentChange}
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {isEditing ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    );
}