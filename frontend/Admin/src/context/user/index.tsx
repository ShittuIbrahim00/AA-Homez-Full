// context/user.tsx
import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/user";

type UserContextType = [User | null, React.Dispatch<React.SetStateAction<User | null>>];

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user from localStorage when the app initializes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const userData: User = JSON.parse(userStr);
          setUser(userData);
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
        }
      }
    }
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};
