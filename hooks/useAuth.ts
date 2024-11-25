import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router, useRouter, useSegments } from 'expo-router';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const segments: string[] = useSegments();
    const router: Router = useRouter();

    useEffect(() => {
        const auth: Auth = getAuth()
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoading(false);
        })
    }, [])

    useEffect(() => {
        if (isLoading) return;
        const inAuthGroup: boolean = segments.includes('(auth)');
        if (user && inAuthGroup) {
            router.replace('../(tabs)');
        } else if (!user && !inAuthGroup) {
            router.replace('../(auth)/login');
        }
    }, [user, segments, isLoading])

    return { user, isLoading }
}