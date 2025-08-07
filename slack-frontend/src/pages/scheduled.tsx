import { useState, useEffect } from "react";
import { Navigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  RefreshCw, 
  Trash2,
  Clock,
  MessageSquare,
  Send,
  X,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiService, ScheduledMessage } from "@/services/api";

export default function Scheduled() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load scheduled messages
  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const userId = "U0995J12K46"; // Your actual user ID
      const messageList = await apiService.getScheduledMessages(userId, statusFilter);
      setMessages(messageList);
      console.log('Loaded messages:', messageList);
    } catch (error) {
      console.error('Failed to load scheduled messages:', error);
      toast({
        title: "Error",
        description: "Failed to load scheduled messages.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [statusFilter]);

  const handleCancel = async (messageId: string) => {
    try {
      const result = await apiService.cancelScheduledMessage(messageId);
      
      if (result.success) {
        toast({
          title: "Message Cancelled",
          description: "The scheduled message has been cancelled.",
        });
        loadMessages(); // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to cancel message');
      }
    } catch (error: any) {
      console.error('Error cancelling message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel message.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (message: ScheduledMessage) => {
    const channelName = message.channelId.startsWith('C') ? `#${message.channelId}` : message.channelId;
    const scheduledTimeIST = new Date(message.scheduledTime).toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    toast({
      title: "Message Details",
      description: `Channel: ${channelName}\nStatus: ${message.status}\nScheduled: ${scheduledTimeIST}`,
    });
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch =
      message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.channelId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusCounts = () => {
    return {
      total: messages.length,
      pending: messages.filter(m => m.status === 'pending').length,
      sent: messages.filter(m => m.status === 'sent').length,
      cancelled: messages.filter(m => m.status === 'cancelled').length,
      failed: messages.filter(m => m.status === 'failed').length
    };
  };

  const stats = getStatusCounts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'sent': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
      case 'failed': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scheduled Messages</h1>
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-lg">View and manage your scheduled Slack messages.</p>
            <Button 
              onClick={loadMessages}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="neumorphic-card border-0">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 rounded-xl bg-gradient-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
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
                  <Target className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="neumorphic-card border-0 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 neumorphic-card border-0 bg-muted/20"
                />
              </div>

              <div className="flex gap-2">
                {['all', 'pending', 'sent', 'cancelled', 'failed'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card className="neumorphic-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-secondary/10">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              Scheduled Messages
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {messages.length === 0 
                    ? "No scheduled messages yet. Create one from the composer!" 
                    : "No messages match your search criteria."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors"
                  >
                    {/* Message Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">#{message.channelId}</span>
                        <Badge className={cn("text-xs border", getStatusColor(message.status))}>
                          {message.status.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Created: {new Date(message.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground max-w-2xl">
                        {message.message}
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">
                          Scheduled: {new Date(message.scheduledTime).toLocaleString('en-IN', { 
                            timeZone: 'Asia/Kolkata',
                            year: 'numeric',
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {message.sentAt && (
                          <span className="text-xs text-green-600">
                            Sent: {new Date(message.sentAt).toLocaleString('en-IN', { 
                              timeZone: 'Asia/Kolkata',
                              year: 'numeric',
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                        {message.errorMessage && (
                          <span className="text-xs text-red-600">
                            Error: {message.errorMessage}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(message)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {message.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(message.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
