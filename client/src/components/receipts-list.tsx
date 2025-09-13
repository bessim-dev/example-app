"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, CreditCard, Calendar } from "lucide-react"

const receipts = [
    {
        id: "INV-2024-001",
        date: "2024-11-15",
        amount: 29.0,
        status: "paid",
        plan: "Pro Plan",
        period: "Nov 15 - Dec 15, 2024",
    },
    {
        id: "INV-2024-002",
        date: "2024-10-15",
        amount: 29.0,
        status: "paid",
        plan: "Pro Plan",
        period: "Oct 15 - Nov 15, 2024",
    },
    {
        id: "INV-2024-003",
        date: "2024-09-15",
        amount: 29.0,
        status: "paid",
        plan: "Pro Plan",
        period: "Sep 15 - Oct 15, 2024",
    },
    {
        id: "INV-2024-004",
        date: "2024-08-15",
        amount: 9.0,
        status: "paid",
        plan: "Starter Plan",
        period: "Aug 15 - Sep 15, 2024",
    },
    {
        id: "INV-2024-005",
        date: "2024-07-15",
        amount: 9.0,
        status: "paid",
        plan: "Starter Plan",
        period: "Jul 15 - Aug 15, 2024",
    },
]

export function ReceiptsList() {
    return (
        <div className="space-y-4">
            {receipts.map((receipt) => (
                <div
                    key={receipt.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">{receipt.id}</span>
                                <Badge variant={receipt.status === "paid" ? "default" : "secondary"} className="text-xs">
                                    {receipt.status}
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{receipt.date}</span>
                                </div>
                                <span>{receipt.plan}</span>
                                <span>{receipt.period}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="font-medium">${receipt.amount.toFixed(2)}</span>
                        <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
