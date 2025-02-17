'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function OfflinePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">You&apos;re Offline</h1>
      <p className="text-lg mb-8">
        Sorry, you&apos;re currently offline. The ÇM44-1 and shuttle schedules require an internet connection to show real-time updates.
      </p>
      <p className="mb-8">
        Some features may still work with cached data.
      </p>
      <Button 
        onClick={() => router.refresh()}
        className="mb-4"
      >
        Try Again
      </Button>
      <p className="text-sm text-gray-500">
        Tip: When online, schedules are automatically cached for offline viewing.
      </p>
    </div>
  );
} 