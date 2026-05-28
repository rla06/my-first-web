"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SketchLayout from "@/components/SketchLayout";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Posts page error", error);
  }, [error]);

  return (
    <SketchLayout>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">목록을 불러올 수 없습니다.</h2>
        <p className="text-sm text-muted-foreground">잠시 후 다시 시도해 주세요.</p>
        <div className="flex gap-2">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" asChild>
            <Link href="/">홈으로</Link>
          </Button>
        </div>
      </div>
    </SketchLayout>
  );
}
