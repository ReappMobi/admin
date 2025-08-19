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
import { Banknote, Home, Landmark, LogOut } from 'lucide-react';

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
  {
    title: 'Doações',
    url: '/donations',
    icon: Banknote,
  },
] as const;

export function AppSidebar() {
  const { logout, getUser } = useAuthStore();
  const primaryColor = '#7B9D7C';

  const handleLogout = async () => {
    logout();
  };

  return (
    <Sidebar
      className="flex flex-col h-full"
      style={{
        backgroundColor: 'white',
        color: 'black',
        boxShadow: '5px 0 15px rgba(0, 0, 0, 0.1)',
      }}
    >
      <SidebarHeader className="mb-8">
        <div className="flex flex-col items-center mb-6">
          <div className="rounded-2xl p-3 mb-4 shadow-lg">
            <Landmark size={32} style={{ color: primaryColor }} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Reapp</h1>
          <p className="text-sm opacity-90 mt-1">Painel Administrativo</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroupContent>
          <SidebarMenu className="space-y-1">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="transition-all duration-300 hover:scale-[1.02]"
                >
                  <Link
                    to={item.url}
                    className="flex items-center gap-4 py-4 px-5 rounded-xl"
                    activeProps={{
                      className:
                        'bg-white text-[#7B9D7C] font-semibold shadow-lg',
                      style: {
                        transform: 'scale(1.02)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    inactiveProps={{
                      className: 'bg-transparent hover:bg-white/10',
                    }}
                  >
                    <div className="p-2 rounded-lg bg-white/20">
                      <item.icon size={20} />
                    </div>
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter className="pt-4 border-t border-white/20">
        <div className="flex items-center gap-3 mb-6 px-3 py-2 rounded-xl bg-white/10">
          <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-bold text-lg">
              {getUser()?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium truncate">{getUser()?.name}</p>
            <p className="text-xs opacity-80">Administrador</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-300 group"
        >
          <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-colors">
            <LogOut size={18} />
          </div>
          <span className="font-medium">Sair</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
