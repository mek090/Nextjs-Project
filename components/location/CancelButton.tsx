"use client";

import { Button } from "@/components/ui/button";

export default function CancelButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.history.back()}
    >
      ยกเลิก
    </Button>
  );
} 