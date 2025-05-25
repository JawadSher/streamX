"use client";

import {
  Badge,
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Loader2,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/legacy/image";
import { ROUTES } from "@/lib/api/ApiRoutes";
import Link from "next/link";
import { toast } from "sonner";
import { useLogoutUser } from "@/hooks/useUser";
import { useDispatch } from "react-redux";;
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface INavUserProps {
  fullName: string | null | undefined;
  email: string | null | undefined;
  avatar: string | null | undefined;
  isVerified: boolean | null | undefined;
}

export function NavUser({ user }: { user: INavUserProps }) {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const router = useRouter();
  const { mutate, isError, error, isSuccess, isPending, data } =
    useLogoutUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message);
    }

  }, [isError, error, isPending, data, router, dispatch]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isPending ? (
          <Loader2 size={24} className="animate-spin mx-auto" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="Image"
                      width={32}
                      height={32}
                      className="rounded-2xl object-cover"
                      quality={50}
                      loading="lazy"
                    />
                  ) : (
                    <AvatarFallback className="rounded-lg">G</AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.fullName}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="Image"
                        width={32}
                        height={32}
                        className="rounded-2xl object-cover"
                        quality={50}
                        loading="lazy"
                      />
                    ) : (
                      <AvatarFallback className="rounded-lg">G</AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.fullName}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={ROUTES.PAGES_ROUTES.ACCOUNT}>
                  <DropdownMenuItem className="cursor-pointer">
                    {user.isVerified ? <BadgeCheck /> : <Badge />}
                    Account
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer">
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form onSubmit={handleSubmit} className="w-full">
                  <button
                    type="submit"
                    className="m-0 p-0 bg-transparent h-full w-full dark:text-gray-100 font-normal flex justify-start hover:bg-transparent cursor-pointer gap-2"
                  >
                    <LogOut />
                    Logout
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
