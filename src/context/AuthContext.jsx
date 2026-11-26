
import { createContext, useContext, useEffect, useState } from "react";
import { restoreAuthSession } from "../config/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("dentalcare_user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const success = await restoreAuthSession();

                if (!success) {
                    setUser(null);
                }
            } catch (error) {
                console.error("Session restoration error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-gray-500">
                    Restoring your session...
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
