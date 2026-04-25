import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'mint'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 hover:shadow-md active:bg-brand-700 shadow-sm',
  secondary:
    'bg-neutral-0 text-neutral-700 border border-neutral-300 hover:bg-neutral-50 hover:shadow-md active:bg-neutral-100 shadow-sm',
  ghost:
    'bg-transparent text-neutral-600 hover:bg-neutral-100 hover:shadow-sm active:bg-neutral-200',
  danger:
    'bg-neutral-0 text-danger-500 border border-danger-500 hover:bg-danger-50 hover:shadow-md active:bg-danger-100',
  mint:
    'bg-mint-500 text-[#0f172a] hover:bg-mint-600 hover:shadow-md active:bg-mint-700 shadow-sm',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-sm rounded-xl gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={[
        'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
