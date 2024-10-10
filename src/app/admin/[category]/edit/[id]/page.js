'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../../../utils/auth';
import { fetchResourceById, updateResource } from '../../../../utils/api';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function EditCategoryPage({ params }) {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();
    const { category, id } = params;

    useEffect(() => {
        const checkAuthAndLoadItem = async () => {
            if (!isAuthenticated()) {
                router.push('/login');
                return;
            }

            if (!category || !id) {
                setError('Invalid category or id');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                console.log(`Fetching ${category} with id: ${id}`);
                const data = await fetchResourceById(category, id);
                console.log(`Fetched data:`, data);
                setFormData(data);
            } catch (error) {
                console.error(`Failed to fetch ${category}:`, error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthAndLoadItem();
    }, [category, id, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleContentChange = (value) => {
        setFormData(prevData => ({ ...prevData, content: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(`Submitting updated data for ${category}:`, formData);
            const updatedData = await updateResource(category, id, formData);
            console.log(`Successfully updated ${category}:`, updatedData);
            router.push(`/admin/${category}`);
        } catch (error) {
            console.error(`Failed to update ${category}:`, error);
            setError(error.message);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Edit {category}</h1>
            <Link href={`/admin/${category}`} className="text-blue-500 hover:underline mb-4 block">
                Back to {category} Management
            </Link>

            <form onSubmit={handleSubmit} className="space-y-4">
                {category === 'skills' && (
                    <>
                        <div>
                            <label className="block mb-2">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Description:</label>
                            <MDEditor
                                value={formData.description || ''}
                                onChange={(value) => setFormData(prevData => ({ ...prevData, description: value }))}
                            />
                        </div>
                    </>
                )}

                {(category === 'websites' || category === 'music' || category === 'contributions') && (
                    <>
                        <div>
                            <label className="block mb-2">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Description:</label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows="4"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">URL:</label>
                            <input
                                type="url"
                                name="url"
                                value={formData.url || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Content:</label>
                            <MDEditor
                                value={formData.content || ''}
                                onChange={handleContentChange}
                            />
                        </div>
                    </>
                )}

                {category === 'education' && (
                    <>
                        <div>
                            <label className="block mb-2">Institution:</label>
                            <input
                                type="text"
                                name="institution"
                                value={formData.institution || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Degree:</label>
                            <input
                                type="text"
                                name="degree"
                                value={formData.degree || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Field of Study:</label>
                            <input
                                type="text"
                                name="fieldOfStudy"
                                value={formData.fieldOfStudy || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Start Date:</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2">End Date:</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Description:</label>
                            <textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows="4"
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Update
                </button>
            </form>
        </div>
    );
}