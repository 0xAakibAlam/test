import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Shield, Users, Lock } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const Landing = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="bg-gradient-to-b from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="backdrop-blur-sm bg-background/50"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          {/* Hero Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-10 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300" />
                <div className="relative aspect-square w-24 sm:w-32 md:w-36 rounded-full bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
                  <img 
                    src="/AnonQA.png" 
                    alt="AnonQA" 
                    className="h-full w-full object-contain" 
                  />
                </div>
              </div>

              <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                AnonQA
              </h1>
            </div>
            
            <p className="text-2xl mb-8 text-muted-foreground max-w-2xl">
              The decentralized Q&A platform where your voice matters, powered by blockchain technology
            </p>

            <div className="flex gap-2 sm:gap-4 w-full sm:w-1/2 max-w-xs sm:max-w-none mx-auto">
              <Link to="/app" className="w-1/2">
                <Button
                  size="lg"
                  className="w-full px-2 py-3 text-sm font-medium bg-primary hover:bg-primary/90 transition-colors sm:px-8 sm:py-6 sm:text-lg"
                >
                  Launch App
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-1/2 px-2 py-3 text-sm font-medium hover:bg-primary/10 transition-colors sm:px-8 sm:py-6 sm:text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 mt-10 sm:mt-14">
            <div className="p-5 sm:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-primary/10 p-3 sm:p-4 rounded-xl w-fit mb-3 sm:mb-4 mx-auto">
                <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">True Anonymity</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Your identity stays protected with wallet-based authentication. No personal data, no tracking.</p>
            </div>

            <div className="p-5 sm:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-primary/10 p-3 sm:p-4 rounded-xl w-fit mb-3 sm:mb-4 mx-auto">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Community Driven</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Join a global network of blockchain enthusiasts sharing knowledge and insights.</p>
            </div>

            <div className="p-5 sm:p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-primary/10 p-3 sm:p-4 rounded-xl w-fit mb-3 sm:mb-4 mx-auto">
                <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">On-Chain Security</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Every interaction is secured on the blockchain, ensuring transparency and immutability.</p>
            </div>
          </div>

          {/* Stats Section */}
          {/* <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Questions Asked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-muted-foreground">Answers Shared</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Active Community</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Landing;
