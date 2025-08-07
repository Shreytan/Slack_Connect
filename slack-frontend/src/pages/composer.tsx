import { useState } from "react";
import { Navigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Calendar, MessageSquare, Send, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Channel {
  id: string;
  name: string;
  members: number;
}

export default function Composer() {
  const [message, setMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // TODO: Fetch channels from backend
  const [channels, setChannels] = useState<Channel[]>([]);

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

    // Simulate API call
    // TODO: call POST /api/messages/send or /api/messages/schedule

    setIsLoading(false);

    if (isScheduled) {
      toast({
        title: "Message Scheduled!",
        description: `Your message will be sent to ${selectedChannel} on ${scheduleDate} at ${scheduleTime}.`,
      });
    } else {
      toast({
        title: "Message Sent!",
        description: `Your message has been sent to ${selectedChannel}.`,
      });
    }

    // Reset form
    setMessage("");
    setSelectedChannel("");
    setScheduleDate("");
    setScheduleTime("");
    setIsScheduled(false);
  };

  const characterCount = message.length;
  const characterLimit = 200;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Message Composer</h1>
          <p className="text-muted-foreground text-lg">Create and schedule messages for your Slack channels.</p>
        </div>

        <Card className="neumorphic-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              New Message
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Channel Selection */}
            <div className="space-y-2">
              <Label htmlFor="channel" className="text-sm font-medium">
                Select Channel
              </Label>
              <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                <SelectTrigger className="border bg-muted/20 rounded-lg">
                  <SelectValue placeholder="Choose a channel..." />
                </SelectTrigger>
                <SelectContent className="neumorphic-card border-0">
                  {channels.length === 0 ? (
                    <div
                      className="p-4 text-sm text-muted-foreground select-none cursor-default"
                      aria-disabled="true"
                      tabIndex={-1}
                    >
                      No channels available. Please connect your workspace.
                    </div>
                  ) : (
                    channels.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{channel.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">{channel.members} members</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <span
                  className={`text-xs ${
                    characterCount > characterLimit ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {characterCount}/{characterLimit}
                </span>
              </div>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] neumorphic-card border-0 bg-muted/20 resize-none"
                maxLength={characterLimit}
              />
            </div>

            {/* Schedule Toggle */}
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-muted/20">
              <Switch id="schedule" checked={isScheduled} onCheckedChange={setIsScheduled} />
              <div className="flex-1">
                <Label htmlFor="schedule" className="text-sm font-medium cursor-pointer">
                  Schedule for Later
                </Label>
                <p className="text-xs text-muted-foreground">
                  {isScheduled ? "Message will be sent at the specified time" : "Send message immediately"}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-accent/10">
                {isScheduled ? (
                  <Calendar className="h-4 w-4 text-accent" />
                ) : (
                  <Send className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Schedule Inputs */}
            {isScheduled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="border bg-muted/20 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="border bg-muted/20 rounded-lg"
                  />
                </div>
              </div>
            )}

            {/* Send Button */}
            <div className="pt-4">
              <Button
                onClick={handleSendMessage}
                loading={isLoading ? true : undefined}
                className="w-full glow-primary h-12"
                disabled={!message.trim() || !selectedChannel || characterCount > characterLimit}
              >
                {isScheduled ? (
                  <>
                    <Clock className="h-4 w-4" />
                    Schedule Message
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
