import SketchLayout from "@/components/SketchLayout";

export default function Loading() {
  return (
    <SketchLayout>
      <div className="space-y-4">
        <div className="h-8 w-2/3 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-11/12 rounded bg-muted animate-pulse" />
          <div className="h-4 w-10/12 rounded bg-muted animate-pulse" />
          <div className="h-4 w-9/12 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </SketchLayout>
  );
}
