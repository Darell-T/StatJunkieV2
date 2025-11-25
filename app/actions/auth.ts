"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error?: string;
};

function sanitizeInput(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = sanitizeInput(formData.get("email"));
  const password = sanitizeInput(formData.get("password"));

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = sanitizeInput(formData.get("email"));
  const password = sanitizeInput(formData.get("password"));
  const favoriteTeam = sanitizeInput(formData.get("favoriteTeam"));
  const favoritePlayersRaw = sanitizeInput(formData.get("favoritePlayers"));

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const metadata: Record<string, unknown> = {};

  if (favoriteTeam) {
    metadata.favorite_team = favoriteTeam;
  }

  if (favoritePlayersRaw) {
    metadata.favorite_players = favoritePlayersRaw
      .split(",")
      .map((player) => player.trim())
      .filter(Boolean);
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/");
  redirect("/sign-in");
}
