import type { Field, Condition, ConditionOperator, ConditionEffect } from '@/schema'
import { ids } from '@/lib/ids'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'

interface Props {
  field: Field
  allFields: Field[]
  onChange: (conditions: Condition[]) => void
}

type OperatorOption = { value: ConditionOperator; label: string }

function getOperatorsForFieldType(type: Field['type']): OperatorOption[] {
  switch (type) {
    case 'single-line-text':
    case 'multi-line-text':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'does-not-equal', label: 'does not equal' },
        { value: 'contains', label: 'contains' },
      ]
    case 'number':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'is-greater-than', label: 'is greater than' },
        { value: 'is-less-than', label: 'is less than' },
        { value: 'is-within-range', label: 'is within range' },
      ]
    case 'single-select':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'does-not-equal', label: 'does not equal' },
      ]
    case 'multi-select':
      return [
        { value: 'contains-any-of', label: 'contains any of' },
        { value: 'contains-all-of', label: 'contains all of' },
        { value: 'contains-none-of', label: 'contains none of' },
      ]
    case 'date':
      return [
        { value: 'equals', label: 'equals' },
        { value: 'is-before', label: 'is before' },
        { value: 'is-after', label: 'is after' },
      ]
    default:
      return []
  }
}

const EFFECT_OPTIONS: { value: ConditionEffect; label: string }[] = [
  { value: 'show', label: 'Show this field' },
  { value: 'hide', label: 'Hide this field' },
  { value: 'mark-required', label: 'Mark as required' },
  { value: 'mark-not-required', label: 'Mark as not required' },
]

function defaultOperatorFor(type: Field['type']): ConditionOperator {
  const ops = getOperatorsForFieldType(type)
  return ops[0]?.value ?? 'equals'
}

function defaultValueFor(op: ConditionOperator): Condition['value'] {
  if (op === 'is-within-range') return [0, 100]
  if (op === 'contains-any-of' || op === 'contains-all-of' || op === 'contains-none-of') return []
  return ''
}

interface ConditionRowProps {
  cond: Condition
  allFields: Field[]
  currentFieldId: string
  onChange: (updated: Condition) => void
  onDelete: () => void
}

function ConditionRow({ cond, allFields, currentFieldId, onChange, onDelete }: ConditionRowProps) {
  const eligibleTargets = allFields.filter(
    f => f.id !== currentFieldId && f.type !== 'section-header' && f.type !== 'calculation',
  )

  const targetField = allFields.find(f => f.id === cond.targetFieldId)
  const operators = targetField ? getOperatorsForFieldType(targetField.type) : []

  function handleTargetChange(targetFieldId: string) {
    const tf = allFields.find(f => f.id === targetFieldId)
    const operator = tf ? defaultOperatorFor(tf.type) : 'equals'
    onChange({ ...cond, targetFieldId, operator, value: defaultValueFor(operator) })
  }

  function handleOperatorChange(operator: ConditionOperator) {
    onChange({ ...cond, operator, value: defaultValueFor(operator) })
  }

  function renderValueInput() {
    if (!targetField) return null

    if (cond.operator === 'is-within-range') {
      const [min, max] = cond.value as [number, number]
      return (
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={min}
            onChange={e => onChange({ ...cond, value: [Number(e.target.value), max] })}
            className="w-20 border border-neutral-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-brand-500"
            placeholder="min"
          />
          <span className="text-xs text-neutral-400">to</span>
          <input
            type="number"
            value={max}
            onChange={e => onChange({ ...cond, value: [min, Number(e.target.value)] })}
            className="w-20 border border-neutral-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-brand-500"
            placeholder="max"
          />
        </div>
      )
    }

    if (targetField.type === 'single-select' && 'options' in targetField) {
      return (
        <select
          value={String(cond.value)}
          onChange={e => onChange({ ...cond, value: e.target.value })}
          className="border border-neutral-300 rounded-md px-2 py-1 text-sm bg-neutral-0 text-neutral-900 focus:outline-none focus:border-brand-500"
        >
          <option value="">Select option…</option>
          {targetField.options.map(o => (
            <option key={o.id} value={o.label}>{o.label}</option>
          ))}
        </select>
      )
    }

    if (targetField.type === 'number') {
      return (
        <input
          type="number"
          value={String(cond.value)}
          onChange={e => onChange({ ...cond, value: Number(e.target.value) })}
          className="w-28 border border-neutral-300 rounded-md px-2 py-1 text-sm bg-neutral-0 text-neutral-900 focus:outline-none focus:border-brand-500"
          placeholder="value"
        />
      )
    }

    if (targetField.type === 'date') {
      return (
        <input
          type="date"
          value={String(cond.value)}
          onChange={e => onChange({ ...cond, value: e.target.value })}
          className="border border-neutral-300 rounded-md px-2 py-1 text-sm bg-neutral-0 text-neutral-900 focus:outline-none focus:border-brand-500"
        />
      )
    }

    return (
      <input
        type="text"
        value={String(cond.value)}
        onChange={e => onChange({ ...cond, value: e.target.value })}
        className="flex-1 border border-neutral-300 rounded-md px-2 py-1 text-sm bg-neutral-0 text-neutral-900 focus:outline-none focus:border-brand-500"
        placeholder="value"
      />
    )
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex gap-2 items-start">
        <div className="flex-1 min-w-0">
          <Select
            options={eligibleTargets.map(f => ({ value: f.id, label: f.label || 'Untitled' }))}
            value={cond.targetFieldId}
            onChange={e => handleTargetChange(e.target.value)}
            placeholder="Choose field…"
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 mt-1 text-neutral-400 hover:text-danger-500 transition-colors"
          aria-label="Remove condition"
        >
          ✕
        </button>
      </div>

      {targetField && (
        <>
          <Select
            options={operators}
            value={cond.operator}
            onChange={e => handleOperatorChange(e.target.value as ConditionOperator)}
          />
          <div className="flex items-center gap-2 flex-wrap">
            {renderValueInput()}
          </div>
          <Select
            options={EFFECT_OPTIONS}
            value={cond.effect}
            onChange={e => onChange({ ...cond, effect: e.target.value as ConditionEffect })}
          />
        </>
      )}
    </div>
  )
}

export function ConditionsConfig({ field, allFields, onChange }: Props) {
  function addCondition() {
    const eligible = allFields.filter(
      f => f.id !== field.id && f.type !== 'section-header' && f.type !== 'calculation',
    )
    if (!eligible.length) return
    const target = eligible[0]
    const operator = defaultOperatorFor(target.type)
    const newCond: Condition = {
      id: ids.condition(),
      targetFieldId: target.id,
      operator,
      value: defaultValueFor(operator),
      effect: 'show',
    }
    onChange([...field.conditions, newCond])
  }

  function updateCondition(updated: Condition) {
    onChange(field.conditions.map(c => (c.id === updated.id ? updated : c)))
  }

  function removeCondition(id: string) {
    onChange(field.conditions.filter(c => c.id !== id))
  }

  const eligibleCount = allFields.filter(
    f => f.id !== field.id && f.type !== 'section-header' && f.type !== 'calculation',
  ).length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          Conditions
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={addCondition}
          disabled={eligibleCount === 0}
        >
          ➕ Add
        </Button>
      </div>

      {field.conditions.length === 0 ? (
        <p className="text-xs text-neutral-400 italic">No conditions — field always uses its defaults.</p>
      ) : (
        <div className="space-y-2">
          {field.conditions.map(cond => (
            <ConditionRow
              key={cond.id}
              cond={cond}
              allFields={allFields}
              currentFieldId={field.id}
              onChange={updateCondition}
              onDelete={() => removeCondition(cond.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
