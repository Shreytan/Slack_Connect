import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConnected(true);
    setWorkspaceName("Cobalt assesment");
    setIsConnecting(false);
    
    toast({
      title: "🚀 Connected to Slack!",
      description: "link established. Ready to schedule messages.",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWorkspaceName("");
    toast({
      title: "🔌 Disconnected from Slack",
      description: "link severed. Reconnect to access.",
      variant: "destructive",
    });
  };

  return (
    <div
      className={cn(
        "neumorphic-card rounded-2xl p-8 relative overflow-hidden cyber-grid",
        "hover:shadow-neon transition-all duration-500 group",
        className
      )}
    >
      {/* Floating orbs */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-pink rounded-full floating-orb opacity-60"></div>
      <div
        className="absolute bottom-6 left-6 w-1 h-1 bg-gradient-cyber rounded-full floating-orb opacity-40"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="gradient-text text-lg font-bold">Slack Connection</div>
            <Zap className="h-4 w-4 text-pink animate-pulse" />
          </div>
          <Settings className="h-5 w-5 text-muted-foreground hover:text-pink transition-colors cursor-pointer" />
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Connection visual */}
          <div className="flex items-center gap-6 flex-1">
            <div
              className={cn(
                "relative p-6 rounded-2xl transition-all duration-500 group/icon",
                isConnected
                  ? "bg-gradient-fusion glow-neon pulse-glow"
                  : "bg-muted/20 hover:bg-muted/30"
              )}
            >
              {/* Connection rings */}
              {isConnected && (
                <>
                  <div className="absolute inset-0 rounded-2xl border-2 border-pink/30 animate-ping"></div>
                  <div className="absolute inset-2 rounded-xl border border-cyber/50 animate-pulse"></div>
                </>
              )}

              <Slack
                className={cn(
                  "h-10 w-10 transition-all duration-500",
                  isConnected ? "text-white drop-shadow-lg" : "text-muted-foreground"
                )}
              />

              {/* Status indicator */}
              <div
                className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                  isConnected ? "bg-success animate-pulse" : "bg-muted-foreground"
                )}
              >
                {isConnected && <div className="w-full h-full bg-success rounded-full animate-ping"></div>}
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">{isConnected && <Wifi className="h-4 w-4 text-success animate-pulse" />}</div>

              <div className="flex items-center gap-3">
                {isConnected ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-success font-medium text-lg">Connected to @{workspaceName}</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-success rounded-full animate-pulse"></div>
                      <div className="w-1 h-4 bg-success rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-1 h-4 bg-success rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground text-lg">link disconnected</span>
                  </>
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
              {isConnected ? "🟢 CONNECTED" : "🔴 DISCONNECTED"}
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
              <Button variant="fusion" size="lg" onClick={handleConnect} loading={isConnecting} className="glow-neon shadow-2xl">
                {isConnecting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Establishing Link...
                  </>
                ) : (
                  <>
                    <Slack className="h-5 w-5" />
                    Connect to Matrix
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
