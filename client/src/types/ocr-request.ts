export type OCRRequest = {
  id: string
  fileName: string
  status: "pending" | "processing" | "completed" | "failed"
  uploadDate: string
  processingTime?: number
  fileSize: number
  textExtracted?: number
  confidence?: number
  userId: string
}

export type OCRRequestStatus = OCRRequest["status"]
