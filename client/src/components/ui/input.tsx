import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[48px] w-full rounded-full border border-[#F5F5F5] bg-[#F5F5F5] px-4 py-2 text-[14px] md:text-[16px] font-medium text-[#262626] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#737373] focus:outline-none focus:ring-0 focus:bg-white focus:border-[#262626] focus:border-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
