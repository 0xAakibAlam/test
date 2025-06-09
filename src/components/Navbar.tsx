import { Link, useLocation } from "react-router-dom";
import { CustomConnectButton } from './ConnectButton';
import { useAppKitAccount } from "@reown/appkit/react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, ArchiveIcon, MessageSquare, Menu, HomeIcon, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav>
      <div className="container px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <img 
                src="/AnonQA.png" 
                alt="AnonQA" 
                className="h-10 w-10 object-contain" 
              /> 
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden p-2 rounded-lg"
                style={{
                  backgroundColor: theme === "light" ? "#F0F0F0" : "#222222",
                }}
              >
                  <Menu className="h-10 w-10" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-screen px-4">
                <DropdownMenuItem asChild>
                  <Link to="/app" className="cursor-pointer w-full">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/app/my-questions" className="cursor-pointer w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      My Posts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/app/my-answers" className="cursor-pointer w-full">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      My Comments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app/archives" className="cursor-pointer w-full">
                    <ArchiveIcon className="mr-2 h-4 w-4" />
                    Archives
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sm:hidden" />
                <DropdownMenuItem 
                  onClick={toggleTheme}
                  className="sm:hidden cursor-pointer"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Light Mode
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:block flex-1 mx-4">
            <NavigationMenu className="float-left">
              <NavigationMenuList className="p-1 rounded-lg shadow-md flex gap-1"
                style={{
                  backgroundColor: theme === "light" ? "#FFFFFF" : "#1A1A1A",
                  borderRadius: "8px",
                  boxShadow: theme === "light" ? "0 6px 20px rgba(0, 0, 0, 0.2)" : "0 6px 20px rgba(0, 0, 0, 0.7)",
                }}
              >
                <NavigationMenuItem>
                  <Link to="/app">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} style={{
                      backgroundColor: location.pathname === "/app" ? (theme === "light" ? "#E0E0E0" : "#3A3A3A") : "",
                      color: theme === "light" ? "#1A1A1A" : "#E0E0E0",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      height: "auto",
                      transition: "all 0.3s ease",
                    }}>
                      <HomeIcon className="mr-2 h-6 w-6" />
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/app/my-questions">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()} style={{
                        backgroundColor: location.pathname === "/app/my-questions" ? (theme === "light" ? "#E0E0E0" : "#3A3A3A") : "",
                        color: theme === "light" ? "#1A1A1A" : "#E0E0E0",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        height: "auto",
                        transition: "all 0.3s ease",
                      }}>
                        <MessageSquare className="mr-2 h-6 w-6" />
                        My Posts
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/app/my-answers">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()} style={{
                        backgroundColor: location.pathname === "/app/my-answers" ? (theme === "light" ? "#E0E0E0" : "#3A3A3A") : "",
                        color: theme === "light" ? "#1A1A1A" : "#E0E0E0",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        height: "auto",
                        transition: "all 0.3s ease",
                      }}>
                        <MessageCircle className="mr-2 h-6 w-6" />
                        My Comments
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/app/archives">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()} style={{
                      backgroundColor: location.pathname === "/app/archives" ? (theme === "light" ? "#E0E0E0" : "#3A3A3A") : "",
                      color: theme === "light" ? "#1A1A1A" : "#E0E0E0",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      height: "auto",
                      transition: "all 0.3s ease",
                    }}>
                      <ArchiveIcon className="mr-2 h-6 w-6" />
                      Archives
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <CustomConnectButton />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              className="hidden sm:flex"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
