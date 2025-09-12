import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ocr-requests/data-table";
import { columns } from "@/components/ocr-requests/columns";
import { sampleOCRRequests } from "@/lib/requests";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export const Route = createFileRoute("/_auth/_dashboardLayout/requests")({
  component: RouteComponent,
});

function RouteComponent() {
  const stats = {
    total: sampleOCRRequests.length,
    completed: sampleOCRRequests.filter((req) => req.status === "completed")
      .length,
    processing: sampleOCRRequests.filter((req) => req.status === "processing")
      .length,
    failed: sampleOCRRequests.filter((req) => req.status === "failed").length,
  };
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">OCR Requests</h1>
        <p className="text-muted-foreground">
          Manage and monitor your optical character recognition requests
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processing}</div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Processing failed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent OCR Requests</CardTitle>
          <CardDescription>
            View and manage your optical character recognition requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={sampleOCRRequests} />
        </CardContent>
      </Card>
    </div>
  );
}
