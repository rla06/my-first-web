type ErrorLike = {
  message?: string;
  code?: string | number;
};

export default function getErrorMessage(error: unknown): string {
  const message =
    typeof error === "string"
      ? error
      : (error as ErrorLike | null)?.message ?? "";
  const code = (error as ErrorLike | null)?.code;
  const normalized = String(message).toLowerCase();

  if (code === 42501 || normalized.includes("42501") || normalized.includes("row-level security")) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  if (normalized.includes("failed to fetch")) {
    return "인터넷 연결을 확인해주세요.";
  }

  if (normalized.includes("not found") || normalized.includes("404")) {
    return "요청한 게시글을 찾을 수 없습니다.";
  }

  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}
