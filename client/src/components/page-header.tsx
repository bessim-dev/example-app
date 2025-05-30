import type { ReactNode } from "react"

interface PageHeaderProps {
  heading: string
  subheading?: string
  children?: ReactNode
}

export function PageHeader({ heading, subheading, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {subheading && <p className="text-sm text-muted-foreground">{subheading}</p>}
      </div>
      {children && <div className="mt-4 md:mt-0">{children}</div>}
    </div>
  )
}
