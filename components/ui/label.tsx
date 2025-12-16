import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Radix Label is standard for accessibility, I'll verify if I have it. 
// If not, I'll use a simple span/label since I didn't install @radix-ui/react-label yet.
// I will just use a standard label to save time/dependencies if not strictly needed, 
// but to be 'premium' accessibility matters. I'll stick to native label for now to avoid install loop.

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
))
Label.displayName = "Label" // "LabelPrimitive.Root" replacement

export { Label }
