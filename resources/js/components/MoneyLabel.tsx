import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Riyal from "./icons/Riyal"
import moneyFormat from "@/lib/moneyFormat"

const moneyLabelVariants = cva(
  "flex items-center justify-end gap-1 text-foreground font-light",
  {
    variants: {
      size: {
        sm: "text-base",
        md: "text-xl",
        lg: "text-3xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface MoneyLabelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof moneyLabelVariants> {
  amount: number
  showIcon?: boolean
  shortenAbove?: number
}

export const MoneyLabel = React.forwardRef<HTMLDivElement, MoneyLabelProps>(
  ({ amount, size = "md", showIcon = true, shortenAbove = 100_000, className, ...props }, ref) => {
    const Tag = size === "lg" ? "h3" : size === "md" ? "p" : "span"
    const iconSize = size === "lg" ? "size-5" : size === "md" ? "size-4" : "size-3"

    return (
      <Tag
        ref={ref as any}
        dir="ltr" // Number still reads left-to-right
        className={cn(moneyLabelVariants({ size }), className)}
        {...props}
      >
        {showIcon && <Riyal className={iconSize} />}
        {moneyFormat(amount, shortenAbove)}
      </Tag>
    )
  }
)

MoneyLabel.displayName = "MoneyLabel"
