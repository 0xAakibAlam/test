import { Link } from "react-router-dom";
import { CustomConnectButton } from './ConnectButton';
import { useAccount } from "wagmi";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, ArchiveIcon, HelpCircle, Menu, HomeIcon, BookOpen } from "lucide-react";
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
  const { isConnected } = useAccount();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <img 
                src="/AnonQA.png" 
                alt="AnonQA" 
                className="h-8 w-8 object-contain" 
              /> 
              <span>AnonQA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block flex-1 mx-4">
            <NavigationMenu className="float-right">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/app">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <HomeIcon className="mr-2 h-4 w-4" />
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {isConnected && (
                  <>
                    <NavigationMenuItem>
                      <Link to="/app/my-questions">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          <HelpCircle className="mr-2 h-4 w-4" />
                          My Questions
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link to="/app/my-answers">
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          My Answers
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </>
                )}
                <NavigationMenuItem>
                  <Link to="/app/archives">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <ArchiveIcon className="mr-2 h-4 w-4" />
                      Archives
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Always visible wallet connect button */}
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

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                {/* <Button variant="ghost" size="icon" > */}
                  <Menu className="h-8 w-8" />
                {/* </Button> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/app" className="cursor-pointer w-full">
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </DropdownMenuItem>
                {isConnected && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/app/my-questions" className="cursor-pointer w-full">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        My Questions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/app/my-answers" className="cursor-pointer w-full">
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Answers
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
