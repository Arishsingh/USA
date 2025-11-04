"use client";

import Link from "next/link";
import { Moon, Sun, User, Settings, LogOut, Sidebar } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  // 💡 Destructure 'theme' and 'resolvedTheme' along with 'setTheme'
  // This ensures the component re-renders correctly when the theme changes.
  const { theme, resolvedTheme, setTheme } = useTheme(); 

  // Optional: A helper to visually see which theme is active
  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <nav className="p-4 flex items-center justify-between bg-white dark:bg-gray-900 border-b dark:border-gray-800">
      {/* Left */}
   <SidebarTrigger/>

      {/* Right */}
        <div className="flex items-center gap-4">
        <Link
            href="/"
            className="text-sm font-medium text-gray-800 hover:text-gray-900 dark:text-gray-200"
        >
            Dashboard
        </Link>

        {/* THEME MENU */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
                variant="outline"
                size="icon"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem 
                onClick={() => setTheme("light")}
                // Optional: Highlight the active theme
                className={currentTheme === "light" ? "bg-accent" : ""}
            >
                Light
            </DropdownMenuItem>
            <DropdownMenuItem 
                onClick={() => setTheme("dark")}
                // Optional: Highlight the active theme
                className={currentTheme === "dark" ? "bg-accent" : ""}
            >
                Dark
            </DropdownMenuItem>
            <DropdownMenuItem 
                onClick={() => setTheme("system")}
                // Optional: Highlight the active theme
                className={theme === "system" ? "bg-accent" : ""}
            >
                System
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        {/* USER MENU */}
        {/* ... (rest of the code is unchanged) */}
        <DropdownMenu>
            <DropdownMenuTrigger>
            <Avatar>
                <AvatarImage src="https://i.pinimg.com/236x/68/31/12/68311248ba2f6e0ba" alt="User Avatar" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
                Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
                <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
                Logout
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    </nav>
  );
};

export default Navbar;