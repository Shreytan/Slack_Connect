import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Send, 
  X, 
  Clock,
  TrendingUp,
  Calendar,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, ScheduledMessage } from "@/services/api";

export default function Dashboard() {
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    teamName?: string;
    userId?: string;
  }>({ connected: false });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const userId = "U0995J12K46"; // Your actual user ID
      
      // Load connection status
      const status = await apiService.checkConnectionStatus(userId);
      setConnectionStatus(status);

      // Load scheduled messages if connected
      if (status.connected) {
        const messages = await apiService.getScheduledMessages(userId, 'all');
        setScheduledMessages(messages);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusCounts = () => {
    return {
      total: scheduledMessages.length,
      pending: scheduledMessages.filter(m => m.status === 'pending').length,
      sent: scheduledMessages.filter(m => m.status === 'sent').length,
      cancelled: scheduledMessages.filter(m => m.status === 'cancelled').length,
      failed: scheduledMessages.filter(m => m.status === 'failed').length
    };
  };

  const stats = getStatusCounts();

  // Get recent activity (last 3 messages)
  const recentActivity = scheduledMessages
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get upcoming messages (pending messages in chronological order)
  const upcomingMessages = scheduledMessages
    .filter(m => m.status === 'pending')
    .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
    .slice(0, 3);

  const handleConnect = () => {
    window.open(apiService.getOAuthUrl(), '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'sent': return 'text-green-600';
      case 'cancelled': return 'text-gray-600';
      case 'failed': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'sent': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome to Slack Connect
              </h1>
              <p className="text-muted-foreground text-lg">
                Send and schedule Slack messages from one dashboard.
              </p>
            </div>
            <Button onClick={loadDashboardData} variant="outline" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="neumorphic-card border-0 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  connectionStatus.connected 
                    ? 'bg-green-500/10' 
                    : 'bg-red-500/10'
                }`}>
                  {connectionStatus.connected ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {connectionStatus.connected ? 'Connected to Slack' : 'Not Connected'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {connectionStatus.connected 
                      ? `Workspace: ${connectionStatus.teamName}`
                      : 'Connect your Slack workspace to get started'
                    }
                  </p>
                </div>
              </div>
              {!connectionStatus.connected && (
                <Button onClick={handleConnect} className="glow-primary">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect Slack
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {connectionStatus.connected ? (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card className="neumorphic-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-xl bg-gradient-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Messages</div>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-xl bg-yellow-500/10">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-xl bg-green-500/10">
                      <Send className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.sent}</div>
                  <div className="text-sm text-muted-foreground">Sent</div>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-xl bg-gray-500/10">
                      <X className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.cancelled}</div>
                  <div className="text-sm text-muted-foreground">Cancelled</div>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-xl bg-red-500/10">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stats.failed}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Upcoming Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentActivity.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No recent activity. Create your first scheduled message!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((message) => (
                        <div key={message.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                          <div className="flex items-center gap-3">
                            <div className={getStatusColor(message.status)}>
                              {getStatusIcon(message.status)}
                            </div>
                            <div>
                              <span className="text-sm text-foreground block">
                                Message {message.status} #{message.channelId}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {message.message.substring(0, 30)}...
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-secondary/10">
                      <Calendar className="h-5 w-5 text-secondary" />
                    </div>
                    Upcoming Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingMessages.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-4">
                      No upcoming messages scheduled.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingMessages.map((message) => (
                        <div key={message.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                          <div>
                            <span className="text-sm text-foreground block">
                              {message.message.substring(0, 25)}...
                            </span>
                            <span className="text-xs text-muted-foreground">
                              #{message.channelId}
                            </span>
                          </div>
                          <span className="text-xs text-accent font-medium">
                            {new Date(message.scheduledTime).toLocaleString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card className="neumorphic-card border-0">
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Connect Your Slack Workspace
              </h3>
              <p className="text-muted-foreground mb-6">
                To get started with scheduling messages, please connect your Slack workspace first.
              </p>
              <Button onClick={handleConnect} className="glow-primary">
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect to Slack
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
