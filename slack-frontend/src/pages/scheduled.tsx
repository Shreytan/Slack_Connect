import { useState } from "react";
import { Navigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { 
  Search, 
  Filter, 
  Calendar, 
  MoreHorizontal, 
  Eye, 
  RefreshCw, 
  Trash2,
  Clock,
  MessageSquare,
  Send,
  X,
  ArrowUpDown,
  Zap,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ScheduledMessage {
  id: string;
  channel: string;
  message: string;
  scheduledTime: string;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  createdAt: string;
}

export default function Scheduled() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("scheduledTime");
  const { toast } = useToast();

  // TODO: Fetch scheduled messages via API

  const [messages, setMessages] = useState<ScheduledMessage[]>([]);

  const handleReschedule = (messageId: string) => {
    toast({
      title: "Reschedule Message",
      description: "Reschedule dialog would open here.",
    });
  };

  const handleCancel = (messageId: string) => {
    toast({
      title: "Message Cancelled",
      description: "The scheduled message has been cancelled.",
      variant: "destructive",
    });
  };

  const handleViewDetails = (messageId: string) => {
    toast({
      title: "Message Details",
      description: "Details modal would open here.",
    });
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch =
      message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Scheduled Messages
          </h1>
          <p className="text-muted-foreground text-lg">
             View and manage your scheduled Slack messages.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="neumorphic-card rounded-xl p-4 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-primary/10">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </div>

          <div className="neumorphic-card rounded-xl p-4 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-pink/10">
                <Clock className="h-4 w-4 text-pink" />
              </div>
              <div>
                <div className="text-lg font-bold text-pink">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </div>

          <div className="neumorphic-card rounded-xl p-4 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Send className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="text-lg font-bold text-success">{stats.sent}</div>
                <div className="text-xs text-muted-foreground">Sent</div>
              </div>
            </div>
          </div>

          <div className="neumorphic-card rounded-xl p-4 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted/20">
                <X className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-lg font-bold text-muted-foreground">{stats.cancelled}</div>
                <div className="text-xs text-muted-foreground">Cancelled</div>
              </div>
            </div>
          </div>

          <div className="neumorphic-card rounded-xl p-4 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Target className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <div className="text-lg font-bold text-destructive">{stats.failed}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="neumorphic-card border-0 mb-8 animate-slide-in-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-cyber/10">
                <Filter className="h-5 w-5 text-cyber" />
              </div>
               Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages or channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 neumorphic-card border-0 bg-muted/20"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {['all', 'pending', 'sent', 'cancelled', 'failed'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "fusion" : "ghost"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "capitalize",
                      statusFilter === status && "glow-neon"
                    )}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card className="neumorphic-card border-0 animate-fade-in-scale">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-fusion/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span className="gradient-text">Scheduled Messages</span>
              </div>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No scheduled messages found.
                </div>
              ) : (
                filteredMessages.map((message, index) => (
                  <div
                    key={message.id}
                    className="neumorphic-card rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Message Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {message.channel}
                          </Badge>
                          <StatusBadge variant={message.status}>
                            {message.status.toUpperCase()}
                          </StatusBadge>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="text-foreground line-clamp-2">
                          {message.message}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Scheduled: {new Date(message.scheduledTime).toLocaleString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(message.id)}
                          className="hover:glow-cyber"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {message.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReschedule(message.id)}
                              className="hover:glow-primary"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCancel(message.id)}
                              className="hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
