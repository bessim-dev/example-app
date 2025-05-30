import { ApiKeysList } from "@/components/api-keys-list";
import { CreateApiKeyButton } from "@/components/create-api-key-button";
import { PageHeader } from "@/components/page-header";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/api-keys")({
  component: RouteComponent,
});

export default function RouteComponent() {
  return (
    <div>
      <div className="flex flex-col gap-8">
        <PageHeader
          heading="API Keys"
          subheading="Create and manage API keys to authenticate with our API">
          <CreateApiKeyButton />
        </PageHeader>
        <ApiKeysList />
      </div>
    </div>
  );
}
