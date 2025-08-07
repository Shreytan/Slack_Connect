import { Navigation } from "@/components/layout/navigation";
import Dashboard from "./dashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Dashboard />
    </div>
  );
};

export default Index;
