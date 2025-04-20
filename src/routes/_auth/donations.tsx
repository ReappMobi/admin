import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/donations')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/donations"!</div>;
}
