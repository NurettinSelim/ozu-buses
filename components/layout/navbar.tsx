'use client';

import Link from 'next/link';
import { Bus, Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 transition-colors hover:text-primary">
            <Bus className="h-5 w-5" />
            <span className="font-semibold text-lg">ÖzÜ Bus</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Schedule
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>About</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <div className="grid grid-cols-1 gap-2">
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="https://www.ozyegin.edu.tr"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="text-sm font-medium leading-none">University Website</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Visit Özyeğin University&apos;s official website
                          </p>
                        </a>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <a
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          href="https://iett.istanbul"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <div className="text-sm font-medium leading-none">IETT</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Official IETT website for all Istanbul public transportation
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link
                  href="/"
                  className="block px-2 py-1 text-lg font-medium transition-colors hover:text-primary"
                >
                  Schedule
                </Link>
                <div className="grid gap-2">
                  <p className="px-2 text-lg font-medium">About</p>
                  <a
                    href="https://www.ozyegin.edu.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 text-sm transition-colors hover:text-primary"
                  >
                    University Website
                  </a>
                  <a
                    href="https://iett.istanbul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-2 py-1 text-sm transition-colors hover:text-primary"
                  >
                    IETT
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="ghost" asChild>
              <Link href="https://github.com/selimb/ozu-buses">
                Source Code
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 