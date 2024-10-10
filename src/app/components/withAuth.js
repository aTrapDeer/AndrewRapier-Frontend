'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../utils/auth';

export default function withAuth(WrappedComponent) {
    return function AuthenticatedComponent(props) {
        const router = useRouter();
        const [isAuth, setIsAuth] = useState(false);

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

        return <WrappedComponent {...props} />;
    };
}