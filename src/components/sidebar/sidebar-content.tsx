"use client";

import { NavMain } from './nav-main'
import { Separator } from '@radix-ui/react-separator'
import { NavMainSubscriptions } from './nav-main-subscriptions'
import { SidebarContent } from '../ui/sidebar'
import { usePathname } from 'next/navigation';

interface Props {
    mediaItems: {
        title: string;
        url: string;
        icon?: string | "";
        css?: string;
        name?: string;
    }[];
    profileItems: {
        title: string;
        url: string;
        icon?: string | "";
        css?: string;
        name?: string;
    }[];
    subscriptionItems: {
        title: string;
        url: string;
        avatar: string;
    }[];
    state: string;
    status: string;
}

const MainSidebarContent = ({ mediaItems, profileItems, subscriptionItems, state, status }: Props) => {
    
  return (
    <SidebarContent className="overflow-y-auto custom-scroll-bar">
      <NavMain items={mediaItems} />

    {status === "authenticated" && (
      <>
        {state === "expanded" && (
          <Separator className="max-w-[230px] mx-auto" />
        )}

        <NavMain items={profileItems} />
        
        {state === "expanded" && (
          <>
            <Separator className="max-w-[230px] mx-auto" />
            <NavMainSubscriptions items={subscriptionItems} />
          </>
        )}
      </>
    )}
  </SidebarContent>
  )
}

export default MainSidebarContent