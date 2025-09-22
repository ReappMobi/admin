import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/auth.store';
import { Link } from '@tanstack/react-router';
import { Home, Landmark } from 'lucide-react';
import { Separator } from './ui/separator';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Instituições',
    url: '/institutions',
    icon: Landmark,
  },
] as const;

export function AppSidebar() {
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    logout();
  };

  return (
    <Sidebar className="p-2 bg-sidebar">
      <SidebarHeader>
        <h1 className="text-2xl font-bold">Reapp</h1>
        <p className="text-nowrap text-xs">Painel do Administrador</p>
        <Separator className="mt-1" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <Link to={'/login'} onClick={handleLogout}>
          Sair
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
