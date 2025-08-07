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
  const [notifications, setNotifications] = useState(true);
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
      title: "⚡ Settings Updated",
      description: "Your neural configurations have been synchronized across all dimensions.",
    });
  };

  const settingsSections = [
    {
      id: "profile",
      title: "Neural Profile",
      icon: User,
      gradient: "gradient-primary"
    },
    {
      id: "notifications", 
      title: "Quantum Notifications",
      icon: Bell,
      gradient: "gradient-pink"
    },
    {
      id: "automation",
      title: "AI Automation",
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
      title: "Cyber Security",
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
            Neural Control Center
          </h1>
          <p className="text-muted-foreground text-lg">
            Configure your quantum workspace and neural link preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="neumorphic-card border-0 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-lg bg-gradient-fusion/10">
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
                    Neural Profile Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Neural ID</Label>
                      <Input 
                        placeholder="Enter your neural identifier"
                        className="neumorphic-card border-0 bg-muted/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Workspace Alias</Label>
                      <Input 
                        placeholder="CyberSpace Labs"
                        className="neumorphic-card border-0 bg-muted/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Bio-Neural Status</Label>
                    <Textarea 
                      placeholder="Connected to the matrix, scheduling quantum messages across parallel dimensions..."
                      className="neumorphic-card border-0 bg-muted/20 min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="neumorphic-card rounded-xl p-4">
                      <div className="text-center">
                        <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                        <div className="font-bold text-lg gradient-text">2.4K</div>
                        <div className="text-xs text-muted-foreground">Messages Sent</div>
                      </div>
                    </div>
                    <div className="neumorphic-card rounded-xl p-4">
                      <div className="text-center">
                        <Cpu className="h-8 w-8 text-pink mx-auto mb-2" />
                        <div className="font-bold text-lg text-pink">99.8%</div>
                        <div className="text-xs text-muted-foreground">Neural Sync</div>
                      </div>
                    </div>
                    <div className="neumorphic-card rounded-xl p-4">
                      <div className="text-center">
                        <Sparkles className="h-8 w-8 text-cyber mx-auto mb-2" />
                        <div className="font-bold text-lg text-cyber">Elite</div>
                        <div className="text-xs text-muted-foreground">Rank Status</div>
                      </div>
                    </div>
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
                    Quantum Notification Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 neumorphic-card rounded-xl">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-pink" />
                        <div>
                          <div className="font-medium">Push Notifications</div>
                          <div className="text-sm text-muted-foreground">Receive real-time quantum alerts</div>
                        </div>
                      </div>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>

                    <div className="flex items-center justify-between p-4 neumorphic-card rounded-xl">
                      <div className="flex items-center gap-3">
                        {soundEnabled ? <Volume2 className="h-5 w-5 text-success" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
                        <div>
                          <div className="font-medium">Sound Effects</div>
                          <div className="text-sm text-muted-foreground">Neural feedback audio cues</div>
                        </div>
                      </div>
                      <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>

                    <div className="flex items-center justify-between p-4 neumorphic-card rounded-xl">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-cyber" />
                        <div>
                          <div className="font-medium">Quantum Sync</div>
                          <div className="text-sm text-muted-foreground">Synchronize across dimensions</div>
                        </div>
                      </div>
                      <Switch checked={quantumSync} onCheckedChange={setQuantumSync} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Notification Frequency</Label>
                    <Select defaultValue="realtime">
                      <SelectTrigger className="neumorphic-card border-0 bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="neumorphic-card border-0">
                        <SelectItem value="realtime">Real-time (Quantum)</SelectItem>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                        <SelectItem value="silent">Silent Mode</SelectItem>
                      </SelectContent>
                    </Select>
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
                    AI Neural Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 neumorphic-card rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5 text-cyber" />
                      <div>
                        <div className="font-medium">Neural Auto-Schedule</div>
                        <div className="text-sm text-muted-foreground">AI predicts optimal send times</div>
                      </div>
                    </div>
                    <Switch checked={autoSchedule} onCheckedChange={setAutoSchedule} />
                  </div>

                  <div className="flex items-center justify-between p-4 neumorphic-card rounded-xl">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-pink" />
                      <div>
                        <div className="font-medium">Neural Enhancement Mode</div>
                        <div className="text-sm text-muted-foreground">Advanced AI message optimization</div>
                      </div>
                    </div>
                    <Switch checked={neuralMode} onCheckedChange={setNeuralMode} />
                  </div>

                  <div className="space-y-3">
                    <Label>AI Intelligence Level</Label>
                    <Select value={aiLevel} onValueChange={setAiLevel}>
                      <SelectTrigger className="neumorphic-card border-0 bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="neumorphic-card border-0">
                        <SelectItem value="basic">Basic Neural Network</SelectItem>
                        <SelectItem value="advanced">Advanced AI Matrix</SelectItem>
                        <SelectItem value="quantum">Quantum Intelligence</SelectItem>
                        <SelectItem value="sentient">Sentient Mode (Beta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {neuralMode && (
                    <div className="p-4 rounded-xl bg-gradient-cyber/10 border border-cyber/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Cpu className="h-5 w-5 text-cyber" />
                        <span className="font-medium text-cyber">Neural Enhancement Active</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Advanced AI algorithms are now analyzing your message patterns and optimizing delivery times across quantum dimensions.
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Appearance */}
            {activeSection === "appearance" && (
              <Card className="neumorphic-card border-0 animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-fusion/10">
                      <Palette className="h-5 w-5 text-primary" />
                    </div>
                    Visual Interface Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 neumorphic-card rounded-xl">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="h-5 w-5 text-cyber" /> : <Sun className="h-5 w-5 text-warning" />}
                      <div>
                        <div className="font-medium">Dark Matrix Mode</div>
                        <div className="text-sm text-muted-foreground">Optimal for extended neural sessions</div>
                      </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>

                  <div className="space-y-3">
                    <Label>Theme Gradient</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { name: "Cyber Fusion", class: "bg-gradient-fusion" },
                        { name: "Pink Wave", class: "bg-gradient-pink" },
                        { name: "Quantum Blue", class: "bg-gradient-cyber" },
                        { name: "Neural Purple", class: "bg-gradient-primary" }
                      ].map((theme) => (
                        <div key={theme.name} className="neumorphic-card rounded-xl p-4 cursor-pointer hover:scale-105 transition-all duration-300 group">
                          <div className={cn("w-full h-16 rounded-lg mb-3", theme.class)}></div>
                          <div className="text-sm font-medium text-center">{theme.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Animation Level</Label>
                    <Select defaultValue="enhanced">
                      <SelectTrigger className="neumorphic-card border-0 bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="neumorphic-card border-0">
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="enhanced">Enhanced (Default)</SelectItem>
                        <SelectItem value="maximum">Maximum Cyber</SelectItem>
                      </SelectContent>
                    </Select>
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
                    Cyber Security Matrix
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
                        <SelectItem value="low">Standard Protection</SelectItem>
                        <SelectItem value="medium">Enhanced Security</SelectItem>
                        <SelectItem value="high">Maximum Encryption</SelectItem>
                        <SelectItem value="quantum">Quantum Encryption</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="neumorphic-card rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="h-5 w-5 text-success" />
                        <span className="font-medium">Firewall Status</span>
                      </div>
                      <div className="text-sm text-success">🟢 Active & Protected</div>
                    </div>

                    <div className="neumorphic-card rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Wifi className="h-5 w-5 text-cyber" />
                        <span className="font-medium">Neural Encryption</span>
                      </div>
                      <div className="text-sm text-cyber">🔒 AES-256 Quantum</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-success" />
                      <span className="font-medium text-success">Security Status: Optimal</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      All neural pathways are secured with quantum-grade encryption. Your messages are protected across all dimensions.
                    </div>
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
                Save Neural Configuration
                <Sparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}