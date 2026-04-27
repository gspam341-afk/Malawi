'use client'

import { useMemo, useState } from 'react'

type RequiredMaterialDraft = {
  name: string
  quantity: number | null
  is_optional: boolean
  provided_in_template: boolean
  note: string
}

const PRESETS = [
  'Scissors',
  'Dice',
  'Paper',
  'Printer',
  'Game pieces',
  'Cards',
  'No extra materials',
] as const

function normalizeName(name: string) {
  return name.trim()
}

function newItem(name = ''): RequiredMaterialDraft {
  return {
    name,
    quantity: null,
    is_optional: false,
    provided_in_template: false,
    note: '',
  }
}

export function RequiredMaterialsEditor() {
  const [items, setItems] = useState<RequiredMaterialDraft[]>([])

  const jsonValue = useMemo(() => {
    return JSON.stringify(
      items
        .map((i) => ({
          ...i,
          name: normalizeName(i.name),
          note: i.note.trim(),
        }))
        .filter((i) => i.name.length > 0),
    )
  }, [items])

  function addPreset(name: string) {
    const normalized = normalizeName(name)

    if (normalized.toLowerCase() === 'no extra materials') {
      setItems([newItem('No extra materials')])
      return
    }

    setItems((prev) => {
      if (prev.some((p) => p.name.trim().toLowerCase() === normalized.toLowerCase())) return prev
      return [...prev, newItem(normalized)]
    })
  }

  function addEmpty() {
    setItems((prev) => [...prev, newItem('')])
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function updateAt(index: number, patch: Partial<RequiredMaterialDraft>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }

  return (
    <div className="mt-4 grid gap-4">
      <input type="hidden" name="required_materials_json" value={jsonValue} />

      <div className="grid gap-2">
        <div className="text-sm font-medium">Quick add</div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => addPreset(p)}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {items.length ? (
          items.map((item, index) => (
            <div key={index} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-sm font-medium">Material</label>
                  <input
                    value={item.name}
                    onChange={(e) => updateAt(index, { name: e.target.value })}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                    placeholder="e.g. Scissors"
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity ?? ''}
                    onChange={(e) =>
                      updateAt(index, {
                        quantity: e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                    min={0}
                  />
                </div>

                <div className="grid gap-1 sm:col-span-2">
                  <label className="text-sm font-medium">Note</label>
                  <input
                    value={item.note}
                    onChange={(e) => updateAt(index, { note: e.target.value })}
                    className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/10"
                    placeholder="Optional notes"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-zinc-800">
                  <input
                    type="checkbox"
                    checked={item.is_optional}
                    onChange={(e) => updateAt(index, { is_optional: e.target.checked })}
                    className="h-4 w-4 accent-zinc-900"
                  />
                  Optional
                </label>

                <label className="flex items-center gap-2 text-sm text-zinc-800">
                  <input
                    type="checkbox"
                    checked={item.provided_in_template}
                    onChange={(e) => updateAt(index, { provided_in_template: e.target.checked })}
                    className="h-4 w-4 accent-zinc-900"
                  />
                  Provided in template
                </label>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="text-sm font-medium text-zinc-700 transition hover:text-zinc-950"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
            No materials added.
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={addEmpty}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
        >
          Add material
        </button>
      </div>
    </div>
  )
}
