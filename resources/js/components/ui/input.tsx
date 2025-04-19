import * as React from "react"

import { cn } from "@/lib/utils"

type InputProps = React.ComponentProps<"input"> & {
  prefix?: string;
  postfix?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, postfix, ...props }, ref) => {
    return (
      <div className="flex flex-row items-center">

        {prefix && (
          <span
            className="flex items-center justify-center h-12 border rounded-md border-e-0 rounded-e-none text-muted min-w-12 bg-secondary"
          >
            {prefix}
          </span>
        )}

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

        {postfix && (
          <span
            className="flex items-center justify-center h-12 border rounded-md border-s-0 rounded-s-none text-muted min-w-12 bg-secondary"
          >
            {postfix}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
