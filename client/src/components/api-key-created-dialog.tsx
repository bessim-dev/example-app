import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface ApiKeyCreatedDialogProps {
  apiKey: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApiKeyCreatedDialog({ apiKey, open, onOpenChange }: ApiKeyCreatedDialogProps) {
  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard
        .writeText(apiKey)
        .then(() => {
          toast.success("New API key copied to clipboard")
        })
        .catch((err) => {
          console.error("Failed to copy: ", err)
          toast.error("Failed to copy API key to clipboard")
        })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key Created</DialogTitle>
          <DialogDescription>
            Your new API key has been created. Please copy it now as you won't be able to see it again.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>This API key will only be displayed once and cannot be retrieved later.</AlertDescription>
          </Alert>

          <div className="flex items-center space-x-2">
            <Input readOnly value={apiKey || ""} className="font-mono" />
            <Button variant="outline" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy API key</span>
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>I've saved my API key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
