"use client";

import { Button } from "@/components/ui/button";

export default function CancelButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.history.back()}
      className="text-xs sm:text-sm px-3 sm:px-4 py-2 h-8 sm:h-10"
    >
      ยกเลิก
    </Button>
  );
} 