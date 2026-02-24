import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-100 text-blue-800',
        secondary: 'bg-slate-100 text-slate-700',
        success: 'bg-emerald-100 text-emerald-800',
        warning: 'bg-amber-100 text-amber-800',
        danger: 'bg-red-100 text-red-800',
        outline: 'border border-slate-200 text-slate-600 bg-transparent',
        // status badges
        stable: 'bg-emerald-100 text-emerald-800',
        beta: 'bg-amber-100 text-amber-800',
        draft: 'bg-slate-100 text-slate-600',
        deprecated: 'bg-red-100 text-red-700',
        // format badges
        remote: 'bg-blue-50 text-blue-700 border border-blue-200',
        onsite: 'bg-purple-50 text-purple-700 border border-purple-200',
        hybrid: 'bg-teal-50 text-teal-700 border border-teal-200',
        // complexity
        L1: 'bg-green-100 text-green-800',
        L2: 'bg-yellow-100 text-yellow-800',
        L3: 'bg-orange-100 text-orange-800',
        // sensitivity
        public: 'bg-slate-100 text-slate-600',
        internal: 'bg-blue-100 text-blue-700',
        confidential: 'bg-amber-100 text-amber-800',
        restricted: 'bg-red-100 text-red-700',
        // category
        category: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
