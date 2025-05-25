import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({
  message = "Loading...",
  fullScreen = false,
}: LoadingProps) {
  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface rounded-3xl">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-text-secondary font-medium text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-text-secondary font-medium text-sm">{message}</p>
    </div>
  );
}
