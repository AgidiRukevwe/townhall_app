import EmptyState from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface rounded-3xl">
      <Card className="w-full max-w-md mx-4 border-none rounded-3xl shadow-none">
        <CardContent className="pt-6">
          <EmptyState
            type="no-content"
            title="Oops! Nothing to see here."
            description="We couldn’t find that page. Maybe try a different link or head back home."
          />
        </CardContent>
      </Card>
    </div>
  );
}
