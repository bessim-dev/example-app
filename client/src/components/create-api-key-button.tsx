"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { ApiKeyCreatedDialog } from "./api-key-created-dialog";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  expiration: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateApiKeyButton({
  variant = "outline",
}: {
  variant?: "outline" | "default";
}) {
  const [open, setOpen] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      expiration: "never",
    },
  });

  const onSubmit = async (data: FormValues) => {
    // In a real app, you would call your API to create a new key
    console.log("Creating API key:", data);
    const { data: apiKey, error } = await authClient.apiKey.create({
      name: data.name,
      expiresIn:
        data.expiration === "never"
          ? undefined
          : Number(data.expiration) * 24 * 60 * 60,
      prefix: "my_app",
      // metadata: {
      //   tier: "premium",
      // },
    });
    if (error) {
      console.error(error);
    }
    setCreatedKey(apiKey?.key ?? null);
    form.reset();
    // Don't close the first dialog until after we've set the created key
    setTimeout(() => setOpen(false), 100);
  };

  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create API Key
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Create a new API key to authenticate with our API.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Production API Key" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name to identify this API key
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an expiration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">365 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      When this API key should expire
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create API Key</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ApiKeyCreatedDialog
        apiKey={createdKey}
        open={!!createdKey}
        onOpenChange={() => setCreatedKey(null)}
      />
    </>
  );
}
