"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Helper to get avatar URL from user metadata
 * Prioritizes custom_avatar (user uploaded) over OAuth provider avatars
 */
function getAvatarUrl(metadata: Record<string, unknown> | undefined): string | null {
  if (!metadata) return null;
  
  // Custom avatar takes priority (persists across OAuth sign-ins)
  if (metadata.custom_avatar) {
    return metadata.custom_avatar as string;
  }
  
  // Fall back to OAuth provider avatar (Google uses both avatar_url and picture)
  return (metadata.avatar_url as string) || (metadata.picture as string) || null;
}

/**
 * UserMenu Component
 * Displays user avatar with dropdown menu for profile actions
 * Handles authentication state, avatar uploads, and sign out
 */
export function UserMenu() {
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Initial user check on mount
    checkUser();

    // Subscribe to auth state changes for real-time updates
    const supabase = getSupabaseBrowserClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          // Clear user state on sign out
          setUser(null);
          setLoading(false);
        } else if (session?.user) {
          // Update user state on sign in or token refresh
          const avatarUrl = getAvatarUrl(session.user.user_metadata);
          
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || 
                  session.user.user_metadata?.name ||
                  session.user.email?.split("@")[0],
            avatar_url: avatarUrl,
          });
          setLoading(false);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Fetches current user data from Supabase
   */
  const checkUser = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (currentUser) {
        const avatarUrl = getAvatarUrl(currentUser.user_metadata);
        
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.user_metadata?.full_name || 
                currentUser.user_metadata?.name ||
                currentUser.email?.split("@")[0],
          avatar_url: avatarUrl,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Signs out the user and redirects to sign-in page
   */
  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/sign-in");
    router.refresh();
  };

  /**
   * Opens the file picker for avatar upload
   */
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handles avatar file upload to Supabase Storage
   * Saves URL to custom_avatar field to persist across OAuth sign-ins
   */
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      if (!currentUser) {
        alert("Please sign in to upload an avatar");
        return;
      }

      // Generate unique filename with user ID and timestamp
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
      const filePath = `${currentUser.id}/${fileName}`;

      // Remove old avatars to save storage space
      const { data: oldFiles } = await supabase.storage
        .from("avatars")
        .list(currentUser.id);
      
      if (oldFiles && oldFiles.length > 0) {
        const filesToDelete = oldFiles.map((f) => `${currentUser.id}/${f.name}`);
        await supabase.storage.from("avatars").remove(filesToDelete);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "0",
          upsert: true,
        });

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError);
        alert(`Failed to upload avatar: ${uploadError.message}`);
        return;
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Save to custom_avatar field (won't be overwritten by OAuth providers)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { custom_avatar: publicUrl },
      });

      if (updateError) {
        console.error("Error updating user:", updateError);
        alert(`Failed to update profile: ${updateError.message}`);
        return;
      }

      // Update local state with cache-busting timestamp for immediate display
      setUser((prev) => prev ? { ...prev, avatar_url: `${publicUrl}?t=${Date.now()}` } : null);
      
      // Reset file input for future uploads
      e.target.value = "";
    } catch (error) {
      console.error("Error handling avatar upload:", error);
      alert("An unexpected error occurred while uploading your avatar");
    } finally {
      setUploading(false);
    }
  };

  // Show loading skeleton while checking auth state
  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    );
  }

  // Show login/signup buttons if not authenticated
  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href="/sign-in">Login</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    );
  }

  // Generate initials for avatar fallback
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <>
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
      
      <DropdownMenu>
        {/* Avatar trigger button */}
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url} alt={user.name || "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        {/* Dropdown menu content */}
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {/* User info header */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {/* Navigation links */}
          <DropdownMenuItem asChild>
            <Link href="/favorites" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>My Favorites</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Avatar upload button */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleAvatarClick}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            <span>{uploading ? "Uploading..." : "Change Avatar"}</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Sign out button */}
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
