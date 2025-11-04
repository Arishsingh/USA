import {
   Home,
   Calendar,
   Search,
   Settings,
   Inbox,
   ChevronUp,
   User2,
   Plus,
   Projector,
 } from "lucide-react";
 import Link from "next/link";
 import Image from "next/image";
 import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupAction,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarSeparator,
 } from "./ui/sidebar";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@radix-ui/react-dropdown-menu";
 import { Slider } from "@/components/ui/slider"
 import { Switch } from "@/components/ui/switch"



 const items = [
   { title: "Home", url: "/", icon: Home },
   { title: " Profit calculator ", url: "/transactions", icon: Inbox },
   { title: " sales update", url: "/sales", icon: Calendar },
   { title: "Buying updates", url: "/balance", icon: Search },
   { title: "Analyze", url: "/analyze", icon: Settings },
 ];

 const AppSidebar = () => {
    return (
      <Sidebar>
       {/* ---------- HEADER ---------- */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/" className="flex items-center gap-2">
                  <span className="font-semibold">Vrdhtech</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
 
        <SidebarSeparator />
       {/* ---------- MAIN CONTENT ---------- */}
       <SidebarContent>
         <SidebarGroup>
           <SidebarGroupLabel>Application</SidebarGroupLabel>
           <SidebarGroupContent>
             <SidebarMenu>
               {items.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild>
                     <Link href={item.url} className="flex items-center gap-2">
                       <item.icon className="h-4 w-4" />
                       <span>{item.title}</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
 
      
       </SidebarContent>
     

 
       {/* ---------- FOOTER ---------- */}
       <SidebarFooter>
         <SidebarMenu>
           <SidebarMenuItem>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <SidebarMenuButton className="flex items-center gap-2">
                   <User2 className="h-4 w-4" />
                   <span> username</span>
                   <ChevronUp className="ml-auto h-4 w-4" />
                 </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="p-2 bg-background rounded-md shadow-md">
                 <DropdownMenuItem>Account</DropdownMenuItem>
                 <DropdownMenuItem>Settings</DropdownMenuItem>
                 <DropdownMenuItem>Sign out</DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
           </SidebarMenuItem>
         </SidebarMenu>
       </SidebarFooter>
     </Sidebar>
   );
 };
 
 export default AppSidebar;
 