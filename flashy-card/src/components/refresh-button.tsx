'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function RefreshButton() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleRefresh}
      className="shadow-sm hover:shadow-md transition-all duration-200"
    >
      <RefreshCw className="h-5 w-5" />
      Refresh
    </Button>
  );
}
