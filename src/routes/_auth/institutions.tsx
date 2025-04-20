import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/institutions')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/institutions"!</div>;
}
