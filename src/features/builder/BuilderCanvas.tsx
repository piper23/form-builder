import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Field } from '@/schema'
import { FieldPreviewCard } from './FieldPreviewCard'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  fields: Field[]
  allFields: Field[]
  selectedFieldId: string | null
  onSelectField: (id: string) => void
  onDeleteField: (id: string) => void
  onReorder: (activeId: string, overId: string) => void
}

export function BuilderCanvas({
  fields,
  allFields,
  selectedFieldId,
  onSelectField,
  onDeleteField,
  onReorder,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      onReorder(String(active.id), String(over.id))
    }
  }

  if (fields.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No fields yet"
        description="Click a field type on the left to add it to your form."
      />
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 p-4 max-w-2xl mx-auto">
          {fields.map(field => (
            <FieldPreviewCard
              key={field.id}
              field={field}
              allFields={allFields}
              isSelected={selectedFieldId === field.id}
              onSelect={() => onSelectField(field.id)}
              onDelete={() => onDeleteField(field.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
