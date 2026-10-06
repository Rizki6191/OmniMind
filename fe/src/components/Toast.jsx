import React from 'react'
import { Check, AlertCircle } from 'lucide-react'

export const ToastContainer = ({ toasts }) => {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2.5 z-[1100] max-w-sm w-full px-4 sm:px-0">
      {toasts.map(toast => {
        const isError = toast.type === 'error'
        return (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-xl border text-xs sm:text-sm font-medium flex items-center gap-3 backdrop-blur-md transition-all duration-200 ${
              isError
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30'
                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/30'
            }`}
          >
            {isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            ) : (
              <Check className="w-4 h-4 shrink-0 text-indigo-500" />
            )}
            <span className="flex-1 truncate">{toast.message}</span>
          </div>
        )
      })}
    </div>
  )
}
