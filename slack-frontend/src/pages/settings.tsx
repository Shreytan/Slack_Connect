import { useState, useEffect } from "react";
import { Navigation } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Save,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { apiService } from "@/services/api";

export default function SettingsPage() {
  // Settings state
  const [displayName, setDisplayName] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [deliveryAlerts, setDeliveryAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  
  // Connection state
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    teamName?: string;
    userId?: string;
  }>({ connected: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();

  // Load user data and connection status
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userId = "U0995J12K46";
      
      // Check connection status
      const status = await apiService.checkConnectionStatus(userId);
      setConnectionStatus(status);
      
      if (status.connected) {
        setWorkspaceName(status.teamName || "");
      }

      // Load saved settings from localStorage
      const savedSettings = localStorage.getItem('slack-connect-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDisplayName(settings.displayName || "");
        setNotifications(settings.notifications ?? true);
        setDeliveryAlerts(settings.deliveryAlerts ?? true);
        setSoundEnabled(settings.soundEnabled ?? true);
        setEmailDigest(settings.emailDigest ?? false);
        setDarkMode(settings.darkMode ?? true);
        setCompactMode(settings.compactMode ?? false);
        setAnimations(settings.animations ?? true);
      }
      
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Save settings
  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Save to localStorage
      const settings = {
        displayName,
        notifications,
        deliveryAlerts,
        soundEnabled,
        emailDigest,
        darkMode,
        compactMode,
        animations,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('slack-connect-settings', JSON.stringify(settings));

      // Apply dark mode to document
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle theme toggle
  const handleThemeToggle = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const settingsSections = [
    {
      id: "profile",
      title: "Profile",
      icon: User,
      description: "Manage your account"
    },
    {
      id: "notifications", 
      title: "Notifications",
      icon: Bell,
      description: "Configure alert preferences"
    },
    {
      id: "appearance",
      title: "Visual Interface",
      icon: Palette,
      description: "Customize app appearance"
    },
  ];

  const [activeSection, setActiveSection] = useState("profile");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading settings...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Settings
              </h1>
              <p className="text-muted-foreground text-lg">
                Configure your account and application preferences.
              </p>
            </div>
            
            {/* Connection Status Badge */}
            <div className="flex items-center gap-2">
              {connectionStatus.connected ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Disconnected</span>
                </div>
              )}
            </div>
          </div>
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
                  <span>Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {settingsSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "w-full justify-start gap-3 text-left h-auto p-4",
                      activeSection === section.id && "bg-primary text-primary-foreground"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      activeSection === section.id 
                        ? "bg-primary-foreground/20" 
                        : "bg-muted/20"
                    )}>
                      <section.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs opacity-70">{section.description}</div>
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
              <Card className="neumorphic-card border-0">
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
                      <Label>Slack User ID</Label>
                      <Input 
                        value={connectionStatus.userId || "U0995J12K46"}
                        disabled
                        className="border bg-muted/20 rounded-lg font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Your unique Slack user identifier
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Workspace Name</Label>
                      <Input 
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="Your Slack Workspace"
                        className="border bg-muted/20 rounded-lg"
                        disabled={!connectionStatus.connected}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="How you'd like to be addressed"
                      className="border bg-muted/20 rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Default Timezone</Label>
                    <Input 
                      value="Asia/Kolkata (IST)"
                      disabled
                      className="border bg-muted/20 rounded-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Timezone used for scheduling messages
                    </p>
                  </div>

                  {!connectionStatus.connected && (
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-center gap-2 text-yellow-600 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="font-medium">Workspace Not Connected</span>
                      </div>
                      <p className="text-sm text-yellow-600/80">
                        Connect your Slack workspace to access all features.
                      </p>
                      <Button 
                        onClick={() => window.open(apiService.getOAuthUrl(), '_blank')}
                        className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
                        size="sm"
                      >
                        Connect Workspace
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary/10">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Enable Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications for app activities
                        </div>
                      </div>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Delivery Alerts</div>
                        <div className="text-sm text-muted-foreground">
                          Get notified when scheduled messages are sent
                        </div>
                      </div>
                    </div>
                    <Switch checked={deliveryAlerts} onCheckedChange={setDeliveryAlerts} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      {soundEnabled ? <Volume2 className="h-5 w-5 text-blue-600" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
                      <div>
                        <div className="font-medium">Sound Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Play sound when notifications appear
                        </div>
                      </div>
                    </div>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Email Digest</div>
                        <div className="text-sm text-muted-foreground">
                          Receive daily email summary of activities
                        </div>
                      </div>
                    </div>
                    <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Visual Interface */}
            {activeSection === "appearance" && (
              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-secondary/10">
                      <Palette className="h-5 w-5 text-secondary" />
                    </div>
                    Visual Interface Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon className="h-5 w-5 text-blue-600" /> : <Sun className="h-5 w-5 text-yellow-600" />}
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-muted-foreground">
                          Use dark theme for better night viewing
                        </div>
                      </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={handleThemeToggle} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Compact Mode</div>
                        <div className="text-sm text-muted-foreground">
                          Reduce spacing for more content on screen
                        </div>
                      </div>
                    </div>
                    <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Smooth Animations</div>
                        <div className="text-sm text-muted-foreground">
                          Enable smooth transitions and animations
                        </div>
                      </div>
                    </div>
                    <Switch checked={animations} onCheckedChange={setAnimations} />
                  </div>

                  {/* Preview Card */}
                  <div className="p-4 rounded-xl border border-dashed border-muted-foreground/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-muted-foreground">Live Preview</span>
                    </div>
                    <div className={cn(
                      "p-3 rounded-lg transition-all duration-200",
                      darkMode ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900",
                      compactMode ? "py-2" : "py-3",
                      animations && "hover:scale-105"
                    )}>
                      <div className="font-medium">Sample Message Card</div>
                      <div className="text-sm opacity-70">This is how your interface will look</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="glow-primary h-12 px-8"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
