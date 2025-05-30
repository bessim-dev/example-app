"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/empty-state";
import { RevokeKeyDialog } from "@/components/revoke-key-dialog";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const apiKeysQueryOptions = queryOptions({
  queryKey: ["api-keys"],
  queryFn: async () => {
    const { data, error } = await authClient.apiKey.list({
      query: {
        limit: 100,
      },
    });
    if (error) {
      throw error;
    }
    return data;
  },
});

const useDeleteApiKeyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await authClient.apiKey.delete({
        keyId: id,
      });
      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key revoked successfully");
    },
  });
};

export function ApiKeysList() {
  const { data: apiKeys } = useQuery(apiKeysQueryOptions);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);
  const { mutate: deleteApiKey } = useDeleteApiKeyMutation();

  const handleCopyKey = (key: string, name: string) => {
    navigator.clipboard
      .writeText(key)
      .then(() => {
        toast.success(`API key "${name}" copied to clipboard`);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy API key to clipboard");
      });
  };

  if (apiKeys?.length === 0 || !apiKeys) {
    return <EmptyState />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            API keys provide authentication to the API. Keep your API keys
            secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{apiKey.name}</h3>
                    {apiKey.expiresAt &&
                    new Date(apiKey.expiresAt) < new Date() ? (
                      <Badge variant="destructive">Expired</Badge>
                    ) : apiKey.expiresAt ? (
                      <Badge variant="outline">
                        Expires{" "}
                        {formatDistanceToNow(new Date(apiKey.expiresAt), {
                          addSuffix: true,
                        })}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-muted px-1 py-0.5 text-sm">
                      {apiKey.id}
                    </code>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopyKey(apiKey.id, apiKey.name!)}>
                      <Copy className="h-3.5 w-3.5" />
                      <span className="sr-only">Copy API key</span>
                    </Button> */}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created{" "}
                    {formatDistanceToNow(new Date(apiKey.createdAt), {
                      addSuffix: true,
                    })}
                    {apiKey.start && (
                      <>
                        {" "}
                        · Last used{" "}
                        {apiKey.lastRequest
                          ? formatDistanceToNow(new Date(apiKey.lastRequest), {
                              addSuffix: true,
                            })
                          : "never"}
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <Button
                    className="text-destructive focus:text-destructive"
                    onClick={() => setKeyToRevoke(apiKey.id)}>
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RevokeKeyDialog
        open={!!keyToRevoke}
        onOpenChange={() => setKeyToRevoke(null)}
        onConfirm={() => keyToRevoke && deleteApiKey(keyToRevoke)}
      />
    </>
  );
}
