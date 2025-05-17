import React, { useState } from "react";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface FormItemWithHintProps {
  children: React.ReactNode;
  label: string;
  hintText?: string;
  errorMessage?: string;
  error?: boolean;
}

export function FormItemWithHint({
  children,
  label,
  hintText,
  errorMessage,
  error = false
}: FormItemWithHintProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onFocus: (e: any) => {
          handleFocus();
          if (child.props.onFocus) child.props.onFocus(e);
        },
        onBlur: (e: any) => {
          handleBlur();
          if (child.props.onBlur) child.props.onBlur(e);
        }
      });
    }
    return child;
  });

  return (
    <FormItem>
      <FormLabel className="text-[#262626] font-semibold text-[14px] md:text-[16px]">
        {label}
      </FormLabel>
      <FormControl>{childrenWithProps}</FormControl>
      
      {/* Show hint text only when focused or error */}
      {(isFocused || error) && (
        <p className={`text-[12px] md:text-[14px] mt-1 ${error ? 'text-[#EF4444]' : 'text-[#737373]'}`}>
          {error ? errorMessage : hintText}
        </p>
      )}
      
      {/* Keep FormMessage for accessibility */}
      <FormMessage className="sr-only" />
    </FormItem>
  );
}