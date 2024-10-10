'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';
import Link from 'next/link';

function AdminPage() {
    const [isAuth, setIsAuth] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        } else {
            setIsAuth(true);
        }
    }, [router]);

    if (!isAuth) {
        return null; // or a loading indicator
    }

    const categories = [
        { title: "Websites", path: "websites" },
        { title: "Music Works", path: "music-works" },
        { title: "Contributions", path: "contributions" },
        { title: "Skills", path: "skills" },
        { title: "Education", path: "education" }
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <AdminCard key={category.path} title={category.title} path={category.path} />
                ))}
            </div>
        </div>
    );
}

function AdminCard({ title, path }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <div className="flex flex-col space-y-2">
                <Link href={`/admin/${path}`} className="text-blue-500 hover:underline">
                    Manage {title}
                </Link>
                <Link href={`/admin/${path}/add`} className="text-green-500 hover:underline">
                    Add New {title.slice(0, -1)}
                </Link>
            </div>
        </div>
    );
}

export default AdminPage;