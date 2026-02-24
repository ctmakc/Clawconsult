'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export interface FilterOption {
  label: string
  value: string
}

interface FilterBarProps {
  filters: FilterOption[]
  activeFilter: string
  searchQuery: string
  filterParam?: string
  searchParam?: string
  searchPlaceholder?: string
  className?: string
}

export function FilterBar({
  filters,
  activeFilter,
  searchQuery,
  filterParam = 'category',
  searchParam = 'q',
  searchPlaceholder = 'Search…',
  className,
}: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to page 1 on filter change
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  function clearAll() {
    router.push(pathname, { scroll: false })
  }

  const hasActiveFilters = activeFilter !== 'all' || searchQuery

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => updateParams(searchParam, e.target.value)}
          className="pl-9 pr-4"
        />
        {searchQuery && (
          <button
            onClick={() => updateParams(searchParam, '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => updateParams(filterParam, f.value === 'all' ? '' : f.value)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              (f.value === 'all' ? activeFilter === 'all' : activeFilter === f.value)
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            )}
          >
            {f.label}
          </button>
        ))}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
