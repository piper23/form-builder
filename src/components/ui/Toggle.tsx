interface Props {
  isOn: boolean
  onChange: (value: boolean) => void
  label?: string
  description?: string
  isDisabled?: boolean
}

export function Toggle({ isOn, onChange, label, description, isDisabled = false }: Props) {
  return (
    <label className={['flex items-center gap-3 cursor-pointer', isDisabled ? 'opacity-50 cursor-not-allowed' : ''].join(' ')}>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={isDisabled}
        onClick={() => !isDisabled && onChange(!isOn)}
        className={[
          'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-brand-500 focus-visible:outline-offset-2',
          isOn ? 'bg-brand-500' : 'bg-neutral-300',
          isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        <span
          className={[
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            isOn ? 'translate-x-4' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm font-medium text-neutral-700">{label}</span>}
          {description && <span className="text-xs text-neutral-500">{description}</span>}
        </span>
      )}
    </label>
  )
}
