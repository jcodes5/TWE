"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Mail,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes"

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  {
    title: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Campaigns",
    href: "/dashboard/admin/campaigns",
    icon: CalendarDays,
  },
  {
    title: "Blog Posts",
    href: "/dashboard/admin/posts",
    icon: FileText,
  },
  {
    title: "Messages",
    href: "/dashboard/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Contacts",
    href: "/dashboard/admin/contacts",
    icon: Mail,
  },
  {
    title: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen pt-16 transition-transform bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-r",
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-64 -translate-x-full lg:w-16 lg:translate-x-0"
        )}
      >
        <div className="h-full px-3 py-4 flex flex-col">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <ScrollArea className="flex-1 -mr-4 pr-4">
            <div className="space-y-1">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.href}
                    asChild
                    variant={pathname === link.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      !isSidebarOpen && "lg:justify-center"
                    )}
                  >
                    <Link href={link.href}>
                      <Icon className="h-4 w-4 mr-2 shrink-0" />
                      <span
                        className={cn(
                          "truncate",
                          !isSidebarOpen && "lg:hidden"
                        )}
                      >
                        {link.title}
                      </span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>

          <div className="pt-2 space-y-2 border-t">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-destructive",
                !isSidebarOpen && "lg:justify-center"
              )}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className={cn("truncate", !isSidebarOpen && "lg:hidden")}>
                Sign Out
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-background/60 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Toggle Button (mobile + desktop) */}
      <Button
        variant="secondary"
        size="icon"
        className={cn(
          "fixed top-20 z-30 transition-all duration-300 inline-flex lg:flex",
          "left-4 lg:left-auto",
          isSidebarOpen ? "lg:left-64" : "lg:left-16"
        )}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 transition-all duration-300",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-16"
        )}
        role="main"
      >
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
