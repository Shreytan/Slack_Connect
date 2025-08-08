import { useState, useEffect } from "react";
import { Navigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Calendar, MessageSquare, Send, Clock, Zap, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiService, Chanel } from "@/services/api";


export default function Composer() {
  const [message, setMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [channels, setChannels] = useState<Chanel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const { toast } = useToast();


  useEffect(() => {
    const loadChannels = async () => {
      try {
        setLoadingChannels(true);
        const userId = "U0995J12K46";
        const channelList = await apiService.getChannels(userId);
        const filteredChannels = channelList.filter(channel => 
          channel.name !== "social" && channel.name !== "new-channel"
        );
        setChannels(filteredChannels);
      } catch (error) {
        console.error('Failed to load channels:', error);
        toast({
          title: "Error",
          description: "Failed to load channels. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setLoadingChannels(false);
      }
    };
    loadChannels();
  }, [toast]);


  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChannel) {
      toast({
        title: "Missing Information",
        description: "Please select a channel and enter a message.",
        variant: "destructive",
      });
      return;
    }


    if (isScheduled && (!scheduleDate || !scheduleTime)) {
      toast({
        title: "Missing Schedule",
        description: "Please select a date and time for your scheduled message.",
        variant: "destructive",
      });
      return;
    }


    setIsLoading(true);


    try {
      const userId = "U0995J12K46";


      if (isScheduled) {
        const localDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
        const scheduledTime = localDateTime.toISOString();
        const result = await apiService.scheduleMessage(userId, selectedChannel, message, scheduledTime);
        
        if (result.success) {
          toast({
            title: "✨ Message Scheduled!",
            description: `Your message will be sent on ${scheduleDate} at ${scheduleTime}.`,
          });
        } else {
          throw new Error(result.error || 'Failed to schedule message');
        }
      } else {
        const result = await apiService.sendMessage(userId, selectedChannel, message);
        
        if (result.success) {
          const channelName = channels.find(c => c.id === selectedChannel)?.name || selectedChannel;
          toast({
            title: "🚀 Message Sent!",
            description: `Your message has been sent to #${channelName}.`,
          });
        } else {
          throw new Error(result.error || 'Failed to send message');
        }
      }


      // Reset form
      setMessage("");
      setSelectedChannel("");
      setScheduleDate("");
      setScheduleTime("");
      setIsScheduled(false);


    } catch (error: any) {
      console.error('Error sending/scheduling message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }


    setIsLoading(false);
  };


  const characterCount = message.length;
  const characterLimit = 4000;


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="lg:pl-64">
        <div className="px-6 py-8 animate-slide-in-up">
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 glass-card rounded-xl">
                <MessageSquare className="h-8 w-8 text-primary animate-pulse-glow" />
              </div>
              <div>
                <h1 className="text-fluid-2xl font-bold gradient-text">
                  Message Composer
                </h1>
                <p className="text-muted-foreground text-fluid-base">
                  Create and schedule messages for your Slack channels
                </p>
              </div>
            </div>
          </div>


          {/* Enhanced Composer Card */}
          <Card className="glass-card border-0 max-w-4xl animate-fade-in-scale">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-fluid-lg">New Message</CardTitle>
              </div>
            </CardHeader>


            <CardContent className="space-y-8">
              {/* Channel Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Select Channel
                </Label>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="glass-card border-0 bg-muted/10 h-14">
                    <SelectValue placeholder="Choose a channel..." />
                  </SelectTrigger>
                  <SelectContent className="glass-card border border-border/50">
                    {loadingChannels ? (
                      <SelectItem value="loading" disabled>
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                          Loading channels...
                        </div>
                      </SelectItem>
                    ) : channels.length === 0 ? (
                      <SelectItem value="no-channels" disabled>
                        No channels available
                      </SelectItem>
                    ) : (
                      channels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          <div className="flex items-center gap-3">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{channel.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {channel.isPrivate ? 'Private channel' : 'Public channel'}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>


              {/* Message Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Message</Label>
                  <div className={`text-sm ${
                    characterCount > characterLimit ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {characterCount.toLocaleString()}/{characterLimit.toLocaleString()}
                  </div>
                </div>
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="glass-card border-0 bg-muted/10 min-h-[150px] resize-none text-base"
                  maxLength={characterLimit}
                />
              </div>


              {/* Schedule Toggle */}
              <div className="glass-card p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <Label className="text-base font-semibold">Schedule for Later</Label>
                      <p className="text-sm text-muted-foreground">
                        {isScheduled ? "Message will be sent at the specified time" : "Send message immediately"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isScheduled}
                    onCheckedChange={setIsScheduled}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>


                {/* Schedule Inputs */}
                {isScheduled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50 animate-slide-in-up">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="glass-card border-0 bg-muted/10"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="glass-card border-0 bg-muted/10"
                      />
                    </div>
                  </div>
                )}
              </div>


              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim() || !selectedChannel}
                className="btn-interactive w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    {isScheduled ? "Scheduling..." : "Sending..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    {isScheduled ? "Schedule Message" : "Send Now"}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
