"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  children: ReactNode;
  className?: string;
};

export function SubmitButton({ children, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className={className}
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? "Please wait..." : children}
    </Button>
  );
}

