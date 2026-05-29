import React, { createContext, useContext, useState } from 'react';
import { useDatabase } from '../database/useDatabase';
import { useSQLiteContext } from 'expo-sqlite';
import { SyncService } from '../services/syncService';

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
    const db = useSQLiteContext();

    // Helper para disparar sync
    const triggerSync = async () => {
        try {
            const syncService = new SyncService(db);
            console.log("🔄 Iniciando sync após autenticação...");
            await syncService.pullSync(); // Primeiro pull para atualizar dados
            await syncService.pushSync(); // Depois push para enviar dados locais
            console.log("✅ Sync concluído com sucesso!");
        } catch (error) {
            console.warn("⚠️ Erro ao fazer sync (continuando mesmo assim):", error);
            // Não falha o login se sync falhar
        }
    };

    const signIn = async (email: string, pass: string) => {
        try {
            const userData = await loginUser(email, pass);
            if (userData) {
                setUser(userData);
                
                // Dispara sync em background
                triggerSync().catch(console.warn);
                
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
                    
                    // Dispara sync em background
                    triggerSync().catch(console.warn);
                    
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