// import * as React from "react";
// import * as ToastPrimitives from "@radix-ui/react-toast";
// import { cva, type VariantProps } from "class-variance-authority";
// import { X, Check } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Icon } from "./icon";

// const ToastProvider = ToastPrimitives.Provider;

// const ToastViewport = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Viewport>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Viewport
//     ref={ref}
//     className={cn(
//       "fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] flex max-h-screen w-full flex-col p-4 md:max-w-[420px]",
//       className
//     )}
//     {...props}
//   />
// ));
// ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

// const toastVariants = cva(
//   "group pointer-events-auto relative flex w-full items-center space-x-4 overflow-hidden rounded-3xl p-4 transition-all data-[swipe=cancel]:translate-y-0 data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full duration-300",
//   {
//     variants: {
//       variant: {
//         default: "bg-[#F5F5F5]",
//         success: "bg-[#F5F5F5]",
//         destructive: "bg-[#F5F5F5]",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//     },
//   }
// );

// const Toast = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Root>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
//     VariantProps<typeof toastVariants> & {
//       showClose?: boolean;
//     }
// >(({ className, variant, showClose = true, children, ...props }, ref) => {
//   return (
//     <ToastPrimitives.Root
//       ref={ref}
//       className={cn(toastVariants({ variant }), className)}
//       {...props}
//     >
//       {children}
//       {showClose && <ToastClose />}
//     </ToastPrimitives.Root>
//   );
// });
// Toast.displayName = ToastPrimitives.Root.displayName;

// const ToastAction = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Action>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Action
//     ref={ref}
//     className={cn(
//       "inline-flex h-8 shrink-0 items-center justify-center rounded-2xl border border-[#EAECF0] bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
//       className
//     )}
//     {...props}
//   />
// ));
// ToastAction.displayName = ToastPrimitives.Action.displayName;

// const ToastClose = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Close>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Close
//     ref={ref}
//     className={cn(
//       "absolute right-3 top-3 rounded-md p-1 text-text-secondary opacity-70 transition-opacity hover:text-text-primary hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2",
//       className
//     )}
//     toast-close=""
//     {...props}
//   >
//     {/* <X className="h-4 w-4" /> */}
//     <Icon name="CloseCircle" size={16} color="#8c8c8c" />
//   </ToastPrimitives.Close>
// ));
// ToastClose.displayName = ToastPrimitives.Close.displayName;

// const ToastIcon = React.forwardRef<
//   HTMLDivElement,
//   React.HTMLAttributes<HTMLDivElement> & {
//     variant?: "success" | "destructive" | "default";
//   }
// >(({ className, variant = "default", ...props }, ref) => {
//   const iconVariants = {
//     success: "bg-green-500 text-white",
//     destructive: "bg-red-500 text-white",
//     default: "bg-gray-500 text-white",
//   };

//   // const IconComponent = variant === "success" ? Check : X;
//   const IconComponent = variant === "success" ? Check : X;

//   let icon;

//   if (variant === "success") {
//     icon = <Icon name="TickCircle" size={16} color="#34C759" />;
//   } else if (variant === "destructive") {
//     icon = <Icon name="CloseCircle" size={16} color="#D92D20" />;
//   } else {
//     icon = <Icon name="InfoCircle" size={16} color="#3B82F6" />; // default info color
//   }

//   return (
//     <div
//       ref={ref}
//       className={cn(
//         "flex h-4 w-8 shrink-0 items-center justify-center rounded-full",
//         iconVariants[variant],
//         className
//       )}
//       {...props}
//     >
//       <div className="h-4 w-4">{icon}</div>
//     </div>
//   );
// });
// ToastIcon.displayName = "ToastIcon";

// const ToastTitle = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Title>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Title
//     ref={ref}
//     className={cn("text-sm font-semibold text-[#262626]", className)}
//     {...props}
//   />
// ));
// ToastTitle.displayName = ToastPrimitives.Title.displayName;

// const ToastDescription = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Description>,
//   React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Description
//     ref={ref}
//     className={cn("text-sm text-[#737373]", className)}
//     {...props}
//   />
// ));
// ToastDescription.displayName = ToastPrimitives.Description.displayName;

// type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

// type ToastActionElement = React.ReactElement<typeof ToastAction>;

// export {
//   type ToastProps,
//   type ToastActionElement,
//   ToastProvider,
//   ToastViewport,
//   Toast,
//   ToastTitle,
//   ToastDescription,
//   ToastClose,
//   ToastAction,
//   ToastIcon,
// };

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icon } from "./icon";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] flex max-h-screen w-full flex-col p-4 md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center space-x-4 overflow-hidden rounded-3xl p-4 transition-all data-[swipe=cancel]:translate-y-0 data-[swipe=end]:translate-y-[var(--radix-toast-swipe-end-y)] data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full duration-300",
  {
    variants: {
      variant: {
        default: "bg-[#F5F5F5]",
        success: "bg-[#F5F5F5]",
        destructive: "bg-[#F5F5F5]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants> & {
      showClose?: boolean;
    }
>(({ className, variant, showClose = true, children, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {children}
      {showClose && <ToastClose />}
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-2xl border border-[#EAECF0] bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-3 top-3 rounded-md p-1 text-[#737373] opacity-70 transition-opacity hover:text-[#262626] hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2",
      className
    )}
    toast-close=""
    {...props}
  >
    <Icon name="CloseCircle" size={16} color="#8c8c8c" variant="Linear" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "success" | "destructive" | "default";
  }
>(({ className, variant = "default", ...props }, ref) => {
  let icon;

  if (variant === "success") {
    icon = <Icon name="TickCircle" size={24} color="#34C759" variant="Bold" />;
  } else if (variant === "destructive") {
    icon = <Icon name="CloseCircle" size={24} color="#D92D20" variant="Bold" />;
  } else {
    icon = <Icon name="InfoCircle" size={24} color="#3B82F6" variant="Bold" />;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center",
        className
      )}
      {...props}
    >
      {icon}
    </div>
  );
});
ToastIcon.displayName = "ToastIcon";

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold text-[#262626]", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm text-[#737373]", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
};
