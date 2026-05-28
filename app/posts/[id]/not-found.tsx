import Link from "next/link";
import { Button } from "@/components/ui/button";
import SketchLayout from "@/components/SketchLayout";

export default function NotFound() {
  return (
    <SketchLayout>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">게시글을 찾을 수 없습니다.</h2>
        <p className="text-sm text-muted-foreground">이미 삭제되었거나 주소가 잘못되었습니다.</p>
        <Button asChild>
          <Link href="/posts">목록으로</Link>
        </Button>
      </div>
    </SketchLayout>
  );
}
