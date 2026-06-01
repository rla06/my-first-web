"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SketchLayout from "@/components/SketchLayout";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <SketchLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h2 className="text-xl font-semibold text-destructive">오류가 발생했습니다.</h2>
        <p className="text-sm text-muted-foreground">
          예기치 않은 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <div className="flex gap-2 mt-4">
          <Button onClick={() => reset()}>다시 시도</Button>
          <Button variant="outline" asChild>
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>
    </SketchLayout>
  );
}
