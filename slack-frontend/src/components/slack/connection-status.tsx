import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slack, CheckCircle, XCircle, Loader2, Zap, Wifi, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);

    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsConnected(true);
    setWorkspaceName("Cobalt Assessment");
    setIsConnecting(false);

    toast({
      title: "🚀 Connected to Slack!",
      description: "Connection established. Ready to schedule messages.",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWorkspaceName("");
    toast({
      title: "🔌 Disconnected from Slack",
      description: "Connection disconnected. Reconnect to access.",
      variant: "destructive",
    });
  };

  return (
    <div
      className={cn(
        "neumorphic-card rounded-2xl p-8 relative",
        "hover:shadow-neon transition-all duration-500 group",
        className
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="gradient-text text-lg font-bold">Slack Connection</div>
            <Zap className="h-4 w-4 text-pink" />
          </div>
          <Settings className="h-5 w-5 text-muted-foreground hover:text-pink transition-colors cursor-pointer" />
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Connection visual */}
          <div
            className={cn(
              "relative p-6 rounded-2xl transition-all duration-500 flex items-center gap-6",
              isConnected ? "bg-gradient-fusion glow-neon" : "bg-muted/20 hover:bg-muted/30"
            )}
          >
            <Slack
              className={cn(
                "h-10 w-10 transition-all duration-500",
                isConnected ? "text-white drop-shadow-lg" : "text-muted-foreground"
              )}
            />

            {/* Status indicator */}
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 border-background",
                isConnected ? "bg-success" : "bg-muted-foreground"
              )}
            ></div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isConnected && <Wifi className="h-4 w-4 text-success" />}
                {isConnected ? (
                  <span className="text-success font-medium text-lg">Connected to @{workspaceName}</span>
                ) : (
                  <span className="text-muted-foreground text-lg">Connection disconnected</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Badge
              variant={isConnected ? "secondary" : "destructive"}
              className={cn("px-4 py-2 text-sm font-medium", isConnected && "bg-gradient-secondary shadow-glow")}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>

            {isConnected ? (
              <Button
                variant="outline"
                size="lg"
                onClick={handleDisconnect}
                className="border-destructive/50 hover:bg-destructive/10"
              >
                <XCircle className="h-4 w-4" />
                Disconnect
              </Button>
            ) : (
              <Button variant="fusion" size="lg" onClick={handleConnect} loading={isConnecting ? true : undefined} className="glow-neon shadow-2xl">
                {isConnecting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Establishing Connection...
                  </>
                ) : (
                  <>
                    <Slack className="h-5 w-5" />
                    Connect
                    <Zap className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
