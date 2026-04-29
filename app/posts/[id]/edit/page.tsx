import SketchLayout from "@/components/SketchLayout";
import dynamic from "next/dynamic";

const EditPostForm = dynamic(() => import("@/components/EditPostForm"), { ssr: false });

export default function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <SketchLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-4">글 수정</h1>
        <div className="p-4 border rounded-md bg-card">
          <EditPostForm id={id} />
        </div>
      </div>
    </SketchLayout>
  );
}
