import { AlertCircle } from 'lucide-react'

type AlertBannerProps = {
  message: string
}

export function AlertBanner({ message }: AlertBannerProps) {
  return (
    <div
      className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
