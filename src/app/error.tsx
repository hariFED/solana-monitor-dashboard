'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4 text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-md">
          {error.message || 'An unexpected error occurred while loading the Sleeping Giants Tracker.'}
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
} 