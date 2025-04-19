import * as React from "react"

import { cn } from "@/lib/utils"

type AffixProps = {
  children: React.ReactNode;
  position: 'prefix' | 'postfix';
};

const Affix: React.FC<AffixProps> = ({ children, position }) => {
  return (
    <span
      className={cn(
        "flex items-center justify-center h-12 border rounded-md text-muted min-w-12 bg-secondary",
        position === 'prefix' ? "border-e-0 rounded-e-none" : "border-s-0 rounded-s-none"
      )}
    >
      {children}
    </span>
  );
};

type InputProps = React.ComponentProps<"input"> & {
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, postfix, ...props }, ref) => {
    return (
      <div className="flex flex-row items-center">

        {prefix && <Affix position="prefix">{prefix}</Affix>}

        <input
          type={type}
          className={cn(
            "flex w-full h-12 border-border rounded-md bg-card px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            prefix ? "rounded-s-none" : "",
            postfix ? "rounded-e-none" : "",
            className
          )}
          ref={ref}
          {...props}
        />

        {postfix && <Affix position="postfix">{postfix}</Affix>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
