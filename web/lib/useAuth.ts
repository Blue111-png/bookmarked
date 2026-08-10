"use client";

import { useCallback, useEffect, useState } from "react";
import { AuthState } from "./types";

const STORAGE_KEY = "bookmarked.auth";

export function useAuth() {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAuth(JSON.parse(raw));
      }
    } catch (err) {
      // ignore corrupted storage
    } finally {
      setReady(true);
    }
  }, []);

  const signIn = useCallback((value: AuthState) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setAuth(value);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  return { auth, ready, signIn, signOut };
}
