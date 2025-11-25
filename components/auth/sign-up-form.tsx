"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction, type AuthFormState } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";

const initialState: AuthFormState = {
  error: undefined,
};

export function SignUpForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="favoriteTeam">Favorite Team (optional)</Label>
        <Input
          id="favoriteTeam"
          name="favoriteTeam"
          placeholder="e.g. Golden State Warriors"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="favoritePlayers">
          Favorite Players (comma separated, optional)
        </Label>
        <Input
          id="favoritePlayers"
          name="favoritePlayers"
          placeholder="e.g. Steph Curry, LeBron James"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton className="w-full">Create Account</SubmitButton>

      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        Or continue with
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleSignInButton label="Sign up with Google" />

      <p className="text-sm text-muted-foreground text-center">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

