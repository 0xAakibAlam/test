import { Link } from "react-router-dom";
import { useWallet } from "@/context/WalletContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, ArchiveIcon, UserIcon, HelpCircle, Menu } from "lucide-react";
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
  const { wallet, CustomConnectButton } = useWallet();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-[92%]">
        <Link to="/app" className="text-xl font-bold flex items-center gap-2">
        <img 
          src="/AnonQA.png" 
          alt="AnonQA" 
          className="h-8 w-8 object-contain" 
        /> 
        <span>AnonQA</span>
        </Link>

        <div className="flex-1 mx-4">
          <NavigationMenu className="float-right hidden md:flex">
            <NavigationMenuList>
              {wallet.isConnected && (
                <>
                  <NavigationMenuItem>
                    <Link to="/app/my-questions">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        My Questions
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/app/my-answers">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        <HelpCircle className="mr-2 h-4 w-4" />
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

        <div className="flex items-center gap-4">
          <CustomConnectButton />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="float-right md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {wallet.isConnected && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/app/my-questions" className="cursor-pointer w-full">
                    <UserIcon className="mr-2 h-4 w-4" />
                    My Questions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/app/my-answers" className="cursor-pointer w-full">
                    <HelpCircle className="mr-2 h-4 w-4" />
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
