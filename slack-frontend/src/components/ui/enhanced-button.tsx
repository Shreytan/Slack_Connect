import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        secondary: "bg-gradient-secondary text-secondary-foreground shadow-lg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        pink: "bg-gradient-pink text-pink-foreground shadow-lg hover:shadow-pink hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        cyber: "bg-gradient-cyber text-cyber-foreground shadow-lg hover:shadow-cyber hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        fusion: "bg-gradient-fusion text-primary-foreground shadow-lg hover:shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        outline: "border border-border bg-card/50 text-foreground backdrop-blur-sm hover:bg-accent/50 hover:text-accent-foreground hover:border-accent/50 transition-all duration-300",
        ghost: "text-foreground hover:bg-accent/20 hover:text-accent-foreground transition-all duration-300",
        destructive: "bg-destructive text-destructive-foreground shadow-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        success: "bg-success text-success-foreground shadow-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300",
        neumorphic: "neumorphic-card text-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 py-2",
        lg: "h-12 px-8 py-3",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };