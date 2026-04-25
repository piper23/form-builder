import type { SectionHeaderField } from '@/schema'

interface Props {
  field: SectionHeaderField
}

const SIZE_CLASSES: Record<SectionHeaderField['size'], string> = {
  xl: 'text-3xl font-bold text-neutral-900',
  lg: 'text-2xl font-semibold text-neutral-900',
  md: 'text-xl font-semibold text-neutral-800',
  sm: 'text-base font-medium text-neutral-800',
  xs: 'text-sm font-medium text-neutral-500',
}

const SIZE_TAG: Record<SectionHeaderField['size'], keyof JSX.IntrinsicElements> = {
  xl: 'h1',
  lg: 'h2',
  md: 'h3',
  sm: 'h4',
  xs: 'h5',
}

export function SectionHeaderDisplay({ field }: Props) {
  const Tag = SIZE_TAG[field.size]
  return (
    <div className="border-b border-neutral-200 pb-2 mt-2">
      <Tag className={SIZE_CLASSES[field.size]}>{field.label}</Tag>
    </div>
  )
}
