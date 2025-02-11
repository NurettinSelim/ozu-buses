'use client';

import Link from 'next/link';
import { Bus } from 'lucide-react';
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

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 md:px-6">
        <div className="flex flex-1 items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2 transition-colors hover:text-primary">
            <Bus className="h-5 w-5" />
            <span className="font-semibold text-lg">ÖzÜ Bus</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
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

        <div className="flex items-center gap-4">
          <div className="flex md:hidden">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-3">Menu</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-2 w-[200px] md:w-[400px]">
                      <div className="grid grid-cols-1 gap-2">
                        <Link href="/" legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Schedule
                          </NavigationMenuLink>
                        </Link>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="https://www.ozyegin.edu.tr"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            University Website
                          </a>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href="https://iett.istanbul"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            IETT
                          </a>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <Button variant="ghost" size="sm" asChild>
            <Link href="https://github.com/selimb/ozu-buses">
              Source Code
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
} 