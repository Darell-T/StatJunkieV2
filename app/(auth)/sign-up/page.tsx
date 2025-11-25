import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata = {
  title: "Create Account | StatJunkie",
};

export default function SignUpPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your StatJunkie account</CardTitle>
        <CardDescription>
          We&apos;ll use this to personalize your dashboard with your favorite
          teams and players.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SignUpForm />
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/" className="underline">
            Return to home
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


