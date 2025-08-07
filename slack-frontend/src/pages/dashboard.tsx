import { StatCard } from "@/components/ui/stat-card";
import { ConnectionStatus } from "@/components/slack/connection-status";
import { 
  MessageSquare, 
  Send, 
  X, 
  Clock,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Total Scheduled",
      value: 24,
      icon: MessageSquare,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Messages Sent",
      value: 156,
      icon: Send,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Cancelled",
      value: 3,
      icon: X,
      trend: { value: 2, isPositive: false }
    },
    {
      title: "Upcoming 24h",
      value: 7,
      icon: Clock,
      trend: { value: 3, isPositive: true }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Slack Connect
          </h1>
          <p className="text-muted-foreground text-lg">
            Schedule smarter, not harder. Manage your Slack messages with ease.
          </p>
        </div>

        {/* Connection Status */}
        <div className="mb-8">
          <ConnectionStatus />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              className={`animate-in slide-in-from-bottom duration-500 [animation-delay:${index * 100}ms]`}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="neumorphic-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-foreground">Message sent to #general</span>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-foreground">Scheduled for #dev-team</span>
                <span className="text-xs text-muted-foreground">4 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-foreground">Message cancelled</span>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </div>

          <div className="neumorphic-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-secondary/10">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Upcoming Messages
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <span className="text-sm text-foreground block">Daily standup reminder</span>
                  <span className="text-xs text-muted-foreground">#dev-team</span>
                </div>
                <span className="text-xs text-accent font-medium">Tomorrow 9:00 AM</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <span className="text-sm text-foreground block">Weekly sync announcement</span>
                  <span className="text-xs text-muted-foreground">#general</span>
                </div>
                <span className="text-xs text-accent font-medium">Friday 2:00 PM</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div>
                  <span className="text-sm text-foreground block">Sprint review invite</span>
                  <span className="text-xs text-muted-foreground">#product</span>
                </div>
                <span className="text-xs text-accent font-medium">Next week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}