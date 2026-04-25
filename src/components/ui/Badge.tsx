import type { ReactNode } from 'react'

type Variant = 'default' | 'brand' | 'mint' | 'danger' | 'success'

interface Props {
  children: ReactNode
  variant?: Variant
  className?: string
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-neutral-100 text-neutral-600',
  brand: 'bg-brand-100 text-brand-700',
  mint: 'bg-mint-100 text-mint-700',
  danger: 'bg-danger-100 text-danger-600',
  success: 'bg-success-50 text-success-500',
}

export function Badge({ children, variant = 'default', className = '' }: Props) {
  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
