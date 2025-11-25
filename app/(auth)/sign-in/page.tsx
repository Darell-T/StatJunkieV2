import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Sign In | StatJunkie",
};

export default function SignInPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to sync your favorite teams, players, and dashboards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SignInForm />
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="underline">
            Return to home
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


