"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import TeamIconList from "@/components/team-icon-list";

export default function HeroSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc =
    mounted && resolvedTheme === "light"
      ? "/statjunkie-light.png"
      : "/statjunkie-high-resolution-logo-transparent.png";
  return (
    <>
      <main className="overflow-x-hidden">
        <section>
          <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
            <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="mx-auto max-w-lg text-center lg:mx-0 lg:w-1/2 lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">
                  Track Live NBA Scores in Real-Time
                </h1>
                <p className="mt-8 max-w-2xl text-pretty text-lg">
                  Get instant updates on games, player statistics, and follow
                  your favorite teams. All the NBA action in one clean
                  dashboard.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button asChild size="lg" className="px-5 text-base">
                    <Link href="/scores">
                      <span className="text-nowrap">View Games</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="px-5 text-base"
                  >
                    <Link href="/player-stats">
                      <span className="text-nowrap">Search a Player</span>
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="order-first mt-8 flex items-center justify-center lg:order-last lg:mt-0 lg:w-1/2 lg:justify-end">
                <Image
                  className="h-48 w-auto object-contain sm:h-64 lg:h-[500px] drop-shadow-2xl"
                  src={logoSrc}
                  alt="StatJunkie Logo"
                  height={500}
                  width={500}
                  key={`${resolvedTheme}-${mounted}`}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-background pb-16 md:pb-32">
          <div className="group relative m-auto max-w-6xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r md:pr-6">
                <p className="text-end text-sm">Every team a click away</p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  <div className="flex">
                    <TeamIconList />
                  </div>
                </InfiniteSlider>

                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
