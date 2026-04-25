import type { Condition, ConditionOperator, ConditionEffect, Field } from '@/schema'

function operatorText(op: ConditionOperator): string {
  switch (op) {
    case 'equals': return 'is'
    case 'does-not-equal': return 'is not'
    case 'contains': return 'contains'
    case 'is-greater-than': return '>'
    case 'is-less-than': return '<'
    case 'is-within-range': return 'is between'
    case 'contains-any-of': return 'includes any of'
    case 'contains-all-of': return 'includes all of'
    case 'contains-none-of': return 'includes none of'
    case 'is-before': return 'before'
    case 'is-after': return 'after'
  }
}

function effectText(effect: ConditionEffect): string {
  switch (effect) {
    case 'show': return '→ Show'
    case 'hide': return '→ Hide'
    case 'mark-required': return '→ Required'
    case 'mark-not-required': return '→ Optional'
  }
}

function valueText(condition: Condition): string {
  const v = condition.value
  if (Array.isArray(v) && v.length === 2 && typeof v[0] === 'number') {
    return `${v[0]} – ${v[1]}`
  }
  if (Array.isArray(v)) return (v as string[]).join(', ')
  return String(v)
}

interface Props {
  conditions: Condition[]
  allFields: Field[]
}

export function ConditionsSummary({ conditions, allFields }: Props) {
  if (conditions.length === 0) return null

  function fieldLabel(id: string): string {
    return allFields.find(f => f.id === id)?.label || 'Unknown field'
  }

  return (
    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
        Rules
      </p>
      {conditions.map(c => (
        <div
          key={c.id}
          className="flex items-start gap-1.5 text-xs text-neutral-500 leading-snug"
        >
          <span className="text-neutral-300 mt-px">⚡</span>
          <span>
            <span className="font-medium text-neutral-600">{fieldLabel(c.targetFieldId)}</span>
            {' '}{operatorText(c.operator)}{' '}
            <span className="font-medium text-neutral-600">{valueText(c)}</span>
            {' '}
            <span className="text-brand-500 font-medium">{effectText(c.effect)}</span>
          </span>
        </div>
      ))}
    </div>
  )
}
