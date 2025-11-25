"use client";

import { useState, useMemo, type ComponentProps } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type GoogleSignInButtonProps = {
  label?: string;
  redirectPath?: string;
};

export function GoogleSignInButton({
  label = "Continue with Google",
  redirectPath = "/dashboard",
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const handleClick = async () => {
    setLoading(true);
    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              redirectPath
            )}`
          : redirectPath;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error("Google sign-in failed", error);
        setLoading(false);
      }
    } catch (err) {
      console.error("Google sign-in threw", err);
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center gap-2"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <GoogleLogo className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}

function GoogleLogo(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.52 12.273c0-.851-.076-1.67-.218-2.455H12v4.64h6.464a5.52 5.52 0 0 1-2.395 3.62v3.01h3.868c2.266-2.084 3.583-5.152 3.583-8.815z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.957-1.073 7.943-2.912l-3.868-3.01c-1.077.72-2.457 1.147-4.075 1.147-3.135 0-5.792-2.118-6.744-4.96H1.233v3.115A11.997 11.997 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.256 14.265A7.204 7.204 0 0 1 4.873 12c0-.786.135-1.547.383-2.265V6.62H1.233A11.997 11.997 0 0 0 0 12c0 1.946.466 3.786 1.233 5.38l4.023-3.115z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.762 0 3.343.606 4.591 1.794l3.444-3.444C17.954 1.212 15.24 0 12 0 7.31 0 3.31 2.69 1.233 6.62l4.023 3.115C6.208 6.868 8.865 4.75 12 4.75z"
      />
    </svg>
  );
}

