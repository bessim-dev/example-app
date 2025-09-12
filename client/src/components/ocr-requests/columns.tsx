import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Download, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { OCRRequest } from "@/types/ocr-request"

const statusVariants = {
  pending: "secondary",
  processing: "default",
  completed: "default",
  failed: "destructive",
} as const

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completed: "bg-green-100 text-green-800 hover:bg-green-100",
  failed: "bg-red-100 text-red-800 hover:bg-red-100",
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatProcessingTime(ms?: number): string {
  if (!ms) return "N/A"
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export const columns: ColumnDef<OCRRequest>[] = [
  {
    accessorKey: "fileName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          File Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fileName = row.getValue("fileName") as string
      return (
        <div className="flex flex-col">
          <span className="font-medium truncate max-w-[200px]" title={fileName}>
            {fileName}
          </span>
          <span className="text-xs text-muted-foreground">{formatFileSize(row.original.fileSize)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as OCRRequest["status"]
      return (
        <Badge variant={statusVariants[status]} className={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "uploadDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Upload Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("uploadDate"))
      return (
        <div className="flex flex-col">
          <span className="font-medium">{date.toLocaleDateString()}</span>
          <span className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "processingTime",
    header: "Processing Time",
    cell: ({ row }) => {
      return <span className="font-mono text-sm">{formatProcessingTime(row.getValue("processingTime"))}</span>
    },
  },
  {
    accessorKey: "textExtracted",
    header: "Text Extracted",
    cell: ({ row }) => {
      const textExtracted = row.getValue("textExtracted") as number | undefined
      const confidence = row.original.confidence

      if (textExtracted === undefined) return <span className="text-muted-foreground">-</span>

      return (
        <div className="flex flex-col">
          <span className="font-medium">{textExtracted.toLocaleString()} chars</span>
          {confidence && <span className="text-xs text-muted-foreground">{confidence}% confidence</span>}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const request = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(request.id)}>
              Copy request ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            {request.status === "completed" && (
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download results
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete request
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
