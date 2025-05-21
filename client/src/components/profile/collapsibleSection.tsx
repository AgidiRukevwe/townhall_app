import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronUp } from "lucide-react";
// import Icon from "../ui/icon";
import { useState } from "react";
import * as IconSax from "iconsax-react";
import { Icon } from "../ui/icon";

interface CollapsibleSectionProps {
  title: string;

  icon?: keyof typeof IconSax;

  children?: React.ReactNode;

  className?: string;
  defaultOpen?: boolean;
}

/**
 * A reusable collapsible section matching the shadcn/ui style.
 *
 * @example
 * <CollapsibleSection title="Bio" icon={<span>📄</span>}>
 *   <p>Some content...</p>
 * </CollapsibleSection>
 */
export default function CollapsibleSection({
  title,
  icon = "ArrowDown2",
  children,
  className = "",
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      // className={`border rounded-lg overflow-hidden ${className}`}
      className={` rounded-lg overflow-hidden pb-4 ${className}`}
    >
      <CollapsibleTrigger
        className={` flex items-center justify-between w-full pb-5 text-left  `}
      >
        <div className="flex items-center gap-2">
          <Icon name={icon} variant="Bold" color="#BFBFBF" size={16} />
          <span className="font-medium text-sm">{title}</span>
        </div>
        <Icon
          name={open ? "ArrowUp2" : "ArrowDown2"}
          variant="Bold"
          size={16}
          color="#BFBFBF"
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="pb-4 text-sm">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
