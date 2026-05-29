import React, { createContext, useContext, useState } from 'react';
import { useDatabase } from '../database/useDatabase';

export interface User {
    id: number;
    name: string;
    email?: string;
    handle: string;
    bio?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    followers: number;
    following: number;
}

interface AuthContextData {
    user: User | null;
    userId: number | null;
    signIn: (email: string, pass: string) => Promise<boolean>;
    signUp: (name: string, email: string, pass: string) => Promise<boolean>;
    signOut: () => void;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const { loginUser, registerUser, getUserById } = useDatabase();

    const signIn = async (email: string, pass: string) => {
        try {
            const userData = await loginUser(email, pass);
            if (userData) {
                setUser(userData);
                return true;
            }
        } catch (error) {
            console.error("Erro no signIn:", error);
        }
        return false;
    };

    const signUp = async (name: string, email: string, pass: string) => {
        try {
            const newUserId = await registerUser(name, email, pass);
            if (newUserId) {
                const userData = await getUserById(newUserId);
                if (userData) {
                    setUser(userData);
                    return true;
                }
            }
        } catch (error) {
            console.error("Erro no signUp:", error);
        }
        return false;
    };

    const signOut = () => {
        setUser(null);
    };

    const updateUser = (data: Partial<User>) => {
        setUser((currentUser) => {
            if (!currentUser) return null;
            return {
                ...currentUser,
                ...data,
            };
        });
    };

    return (
        <AuthContext.Provider value={{ user, userId: user?.id || null, signIn, signUp, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}