"use client";

import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { setAuth } from "@/lib/auth";

type GoogleLoginButtonProps = {
  onSuccess?: () => void;
};

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const loadScript = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.body.appendChild(script);
  });

export function GoogleLoginButton({ onSuccess }: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError("Missing Google client ID.");
      return;
    }

    loadScript("https://accounts.google.com/gsi/client")
      .then(() => {
        const google = window.google?.accounts?.id;
        if (!google || !buttonRef.current) {
          setError("Google login unavailable.");
          return;
        }
        google.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response.credential) {
              setError("Login failed. Try again.");
              return;
            }
            const result = await fetch(`${API_BASE_URL}/auth/google`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken: response.credential })
            });
            if (!result.ok) {
              setError("Could not sign in.");
              return;
            }
            const payload = (await result.json()) as {
              token: string;
              user: { id: string; email: string; name?: string; plan?: string };
            };
            setAuth(payload.token, payload.user);
            onSuccess?.();
          }
        });
        google.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with"
        });
      })
      .catch(() => setError("Google login failed to load."));
  }, [onSuccess]);

  return (
    <div className="space-y-2">
      <div ref={buttonRef} />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
