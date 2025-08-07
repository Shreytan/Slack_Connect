import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "neumorphic-card rounded-xl p-6 group hover:scale-[1.02] transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span className={cn(
                "inline-block w-0 h-0 border-l-[3px] border-r-[3px] border-l-transparent border-r-transparent",
                trend.isPositive 
                  ? "border-b-[5px] border-b-success" 
                  : "border-t-[5px] border-t-destructive"
              )} />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="p-3 rounded-xl bg-gradient-primary/10 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}