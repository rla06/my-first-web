import SketchLayout from "@/components/SketchLayout";

export default function Loading() {
  return (
    <SketchLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-28 rounded bg-muted animate-pulse" />
          <div className="h-9 w-28 rounded bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
              <div className="h-16 w-full rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </SketchLayout>
  );
}
