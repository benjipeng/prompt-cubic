"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Session } from "@supabase/supabase-js";
import { createUserInDatabase } from "@/utils/auth";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          console.log(
            "User:",
            session.user.identities?.[0]?.user_id ?? "Unknown"
          );
          try {
            await createUserInDatabase(session.user.id);
          } catch (error) {
            console.error("Error ensuring user in database:", error);
          }
        } else {
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        try {
          await createUserInDatabase(session.user.id);
        } catch (error) {
          console.error("Error ensuring user in database:", error);
        }
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, loading, setUser, setSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
