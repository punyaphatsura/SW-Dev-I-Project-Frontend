"use client";

// FirebaseAuthContext.tsx
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import firebaseApp, { auth } from "@/configs/firebaseConfig";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type ContextState = { user: User | null };

// const auth = getAuth(firebaseApp);

const FirebaseAuthContext = createContext<ContextState>({ user: null });

const useFirebaseAuthContext = () => useContext(FirebaseAuthContext);

const FirebaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    setLoading(false);

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      {pathName.includes("login") ? (
        <FirebaseAuthContext.Provider value={{ user }}>
          {loading ? <div>Loading...</div> : children}
        </FirebaseAuthContext.Provider>
      ) : (
        children
      )}
    </>
  );
};

export { FirebaseAuthProvider, useFirebaseAuthContext, FirebaseAuthContext };
