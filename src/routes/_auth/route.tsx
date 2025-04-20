import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  beforeLoad({ context, location }) {
    const { auth } = context;
    if (!auth?.isLogged())
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
  },
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className="flex items-center h-screen w-full">
        <AppSidebar />
        <SidebarTrigger> Open </SidebarTrigger>
        <main className="px-4 py-2 flex-1 h-full">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
