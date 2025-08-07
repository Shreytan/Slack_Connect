import { useState } from "react";
import { Navigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  Clock, 
  Palette, 
  Shield, 
  Zap,
  Bot,
  Database,
  Wifi,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Sparkles,
  Cpu
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [neuralMode, setNeuralMode] = useState(false);
  const [quantumSync, setQuantumSync] = useState(true);
  const [privacy, setPrivacy] = useState("high");
  const [aiLevel, setAiLevel] = useState("advanced");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const settingsSections = [
    {
      id: "profile",
      title: "Profile",
      icon: User,
      gradient: "gradient-primary"
    },
    {
      id: "notifications", 
      title: "Notifications",
      icon: Bell,
      gradient: "gradient-pink"
    },
    {
      id: "automation",
      title: "Automation",
      icon: Bot,
      gradient: "gradient-cyber"
    },
    {
      id: "appearance",
      title: "Visual Interface",
      icon: Palette,
      gradient: "gradient-fusion"
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      gradient: "gradient-secondary"
    }
  ];

  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-in-up">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Configure your account and scheduling preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="neumorphic-card border-0 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-gradient-primary/10">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <span className="gradient-text">Modules</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {settingsSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "fusion" : "ghost"}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full justify-start gap-3 text-left h-auto p-4",
                      activeSection === section.id && "glow-neon shadow-neon"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      activeSection === section.id 
                        ? "bg-white/20" 
                        : `bg-${section.gradient}/10`
                    )}>
                      <section.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-muted-foreground">Configure module</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeSection === "profile" && (
              <Card className="neumorphic-card border-0 animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>User ID</Label>
                      <Input 
                        placeholder="Enter your user ID"
                        className="neumorphic-card border-0 bg-muted/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Workspace Name</Label>
                      <Input 
                        placeholder="Enter your workspace name"
                        className="neumorphic-card border-0 bg-muted/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea 
                      placeholder="Tell us about yourself..."
                      className="neumorphic-card border-0 bg-muted/20 min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Notifications */}
            {activeSection === "notifications" && (
              <Card className="neumorphic-card border-0 animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-pink/10">
                      <Bell className="h-5 w-5 text-pink" />
                    </div>
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 neumorphic-card rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">Enable Notifications</div>
                    </div>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Automation */}
            {activeSection === "automation" && (
              <Card className="neumorphic-card border-0 animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-cyber/10">
                      <Bot className="h-5 w-5 text-cyber" />
                    </div>
                    Automation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Auto-Schedule Messages</Label>
                    <Switch checked={autoSchedule} onCheckedChange={setAutoSchedule} />
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Appearance */}
            {activeSection === "appearance" && (
              <Card className="neumorphic-card border-0 animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-fusion/10">
                      <Palette className="h-5 w-5 text-fusion" />
                    </div>
                    Visual Interface Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 neumorphic-card rounded-xl">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="h-5 w-5 text-cyber" /> : <Sun className="h-5 w-5 text-warning" />}
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-muted-foreground">Toggle light/dark theme</div>
                      </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Security */}
            {activeSection === "security" && (
              <Card className="neumorphic-card border-0 animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-secondary/10">
                      <Shield className="h-5 w-5 text-secondary" />
                    </div>
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Privacy Level</Label>
                    <Select value={privacy} onValueChange={setPrivacy}>
                      <SelectTrigger className="neumorphic-card border-0 bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="neumorphic-card border-0">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    All messages are protected with AES-256 encryption.
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                variant="fusion" 
                size="lg" 
                onClick={handleSave}
                className="glow-neon shadow-2xl"
              >
                <Zap className="h-5 w-5" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
