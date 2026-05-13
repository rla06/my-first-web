import dynamic from "next/dynamic";
import SketchLayout from "@/components/SketchLayout";

const LoginForm = dynamic(() => import("@/components/LoginForm"), { ssr: false });

export default function LoginPage() {
  return (
    <SketchLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-4">로그인</h1>
        <div className="p-4 border rounded-md bg-card">
          <LoginForm />
        </div>
      </div>
    </SketchLayout>
  );
}
