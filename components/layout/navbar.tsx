'use client';

import Link from 'next/link';
import { Bus, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 transition-colors hover:text-primary">
            <Bus className="h-5 w-5" />
            <span className="font-semibold text-lg">ÖzÜ Bus</span>
          </Link>

          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://shuttle.ozyegin.edu.tr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              OzU Shuttle
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="https://iett.istanbul/RouteDetail?hkod=%C3%87M44"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              IETT
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
} 