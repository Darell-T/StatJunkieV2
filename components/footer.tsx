"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

const links = [
  {
    title: "Scores",
    href: "/scores",
  },
  {
    title: "Players",
    href: "/players",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
  },
];

export default function FooterSection() {
  return (
    <footer className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <Logo />
        </Link>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-muted-foreground hover:text-primary block duration-150"
            >
              <span>{link.title}</span>
            </Link>
          ))}
        </div>

        <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
          <a
            href="https://github.com/Darell-T"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            onClick={(e) => {
              e.preventDefault();
              window.open("https://github.com/Darell-T", "_blank", "noopener,noreferrer");
            }}
            className="text-muted-foreground hover:text-primary inline-flex items-center justify-center cursor-pointer transition-colors p-2 rounded-md hover:bg-muted/50"
          >
            <Github className="size-6" />
          </a>

          <a
            href="https://www.linkedin.com/in/darell-thompson-1097691b1/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            onClick={(e) => {
              e.preventDefault();
              window.open("https://www.linkedin.com/in/darell-thompson-1097691b1/", "_blank", "noopener,noreferrer");
            }}
            className="text-muted-foreground hover:text-primary inline-flex items-center justify-center cursor-pointer transition-colors p-2 rounded-md hover:bg-muted/50"
          >
            <Linkedin className="size-6" />
          </a>
        </div>

        <span className="text-muted-foreground block text-center text-sm">
          © {new Date().getFullYear()} StatJunkie. Built by Darell Thompson
        </span>
      </div>
    </footer>
  );
}
