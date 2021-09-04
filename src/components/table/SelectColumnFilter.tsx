// This is a custom filter UI for selecting

import { Select } from '@chakra-ui/react'
import React from 'react'
import { ColumnInstance } from 'react-table'

// a unique option from a list
export function SelectColumnFilter<T extends Record<string, unknown>>({
  column: { filterValue, setFilter, preFilteredRows, id },
}: {
  column: ColumnInstance<T>
}): JSX.Element {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set<string>()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    const values = options.values()
    return Array.from(values)
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline min-w-max">
      <Select
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option className="text-gray-700" value="">
          All
        </option>
        {options.map((option, i) => (
          <option className="text-gray-700" key={i} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </label>
  )
}
