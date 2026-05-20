import SketchLayout from "@/components/SketchLayout";
import EditPostForm from "@/components/EditPostForm";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id;
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
