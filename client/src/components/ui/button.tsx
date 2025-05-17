import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[14px] md:text-[16px] font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#1476FF] text-white hover:bg-[#1476FF]/90",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#EF4444]/90",
        outline:
          "border-2 border-[#262626] bg-white text-[#262626] hover:bg-[#F5F5F5]",
        secondary:
          "bg-[#FFB400] text-[#262626] hover:bg-[#FFB400]/80",
        ghost: "hover:bg-[#F5F5F5] text-[#262626]",
        link: "text-[#1476FF] underline-offset-4 hover:underline",
        black: "bg-[#262626] text-white hover:bg-[#404040]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2",
        lg: "h-14 px-8 py-4",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
