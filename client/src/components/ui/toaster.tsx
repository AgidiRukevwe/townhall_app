import { useToast } from "@/hooks/util-hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant = "default",
        ...props
      }) {
        return (
          <Toast
            key={id}
            variant={variant}
            {...props}
            className="flex items-start justify-start"
          >
            <ToastIcon variant={variant ?? "success"} />
            <div className="flex flex-col">
              {title && <ToastTitle className="">{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
