import SketchLayout from "@/components/SketchLayout";
import NewPostForm from "@/components/NewPostForm";

export default function NewPostPage() {
  return (
    <SketchLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-4">새 글 작성</h1>
        <div className="p-4 border rounded-md bg-card">
          <NewPostForm />
        </div>
      </div>
    </SketchLayout>
  );
}
