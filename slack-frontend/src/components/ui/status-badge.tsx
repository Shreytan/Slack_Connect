import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        pending: "border-warning/20 bg-warning/10 text-warning",
        sent: "border-success/20 bg-success/10 text-success",
        cancelled: "border-muted-foreground/20 bg-muted/20 text-muted-foreground",
        failed: "border-destructive/20 bg-destructive/10 text-destructive",
        scheduled: "border-accent/20 bg-accent/10 text-accent"
      }
    },
    defaultVariants: {
      variant: "pending"
    }
  }
);

interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

const statusIcons = {
  pending: "🟡",
  sent: "✅", 
  cancelled: "❌",
  failed: "⚠️",
  scheduled: "🔔"
};

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  const icon = variant ? statusIcons[variant] : "🟡";
  
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      <span className="text-xs">{icon}</span>
      {children}
    </span>
  );
}