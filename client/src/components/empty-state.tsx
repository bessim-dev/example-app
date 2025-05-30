import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key } from "lucide-react"
import { CreateApiKeyButton } from "./create-api-key-button"

export function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your API Keys</CardTitle>
        <CardDescription>API keys provide authentication to the API. Keep your API keys secure.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Key className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No API keys</h3>
        <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
          You haven't created any API keys yet. Create one to get started.
        </p>
        <CreateApiKeyButton variant="default" />
      </CardContent>
    </Card>
  )
}
