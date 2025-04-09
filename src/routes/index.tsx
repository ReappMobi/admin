import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Page,
});

function Page() {
  return (
    <div className="p-2">
      <h3>Reapp Admin</h3>
    </div>
  );
}
