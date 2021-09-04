// This is a custom filter UI for selecting
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  PopoverArrow,
  Portal,
  useMediaQuery,
} from '@chakra-ui/react'
import React from 'react'
import { ColumnInstance } from 'react-table'
import 'react-day-picker/style.css'
import { DayPicker, useInput, UseInputOptions } from 'react-day-picker'
import { format } from 'date-fns'
import { momentUTC } from '../../utils/methods'

/**
 * Sorry for using native date, moment and date-fns all together. Its messed up.
 */

// a unique option from a list
export function filterByDate(rows: any, id: any, filterValue: any): any {
  if (!filterValue) {
    return rows
  }
  const [min, max] = filterValue
    .split('-')
    .map((date: string) => momentUTC(date))

  return rows.filter((row: any) => {
    const date = momentUTC(Number(row.values[id]) * 1000)
    return date.isBetween(min.startOf('day'), max.endOf('day'))
  })
}

export function DateRangeFilter<T extends Record<string, unknown>>({
  column: { filterValue, setFilter, preFilteredRows, id },
}: {
  column: ColumnInstance<T>
}): JSX.Element {
  // Calculate the options for filtering
  // using the preFilteredRows
  const { min, max } = React.useMemo(() => {
    let min = new Date().getTime()
    let max = new Date().getTime()
    preFilteredRows.forEach((row) => {
      const date = Number(row.values[id]) * 1000
      if (Number(date) < min) {
        min = Number(date)
        return
      }

      if (Number(date) > max) {
        max = Number(date)
        return
      }
    })
    return { min, max }
  }, [id, preFilteredRows])

  const [isSmallerThan768] = useMediaQuery('(max-width: 768px)')

  const options: UseInputOptions = {
    // Select today as default
    defaultSelected: momentUTC(new Date()).subtract('1', 'M').toDate(),
    // Limit the valid dates
    fromDate: new Date(min),
    toDate: new Date(max),
    format: 'PP',
    // Make the selection mandatory.
    required: true,
  }

  const input = useInput(options)
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Input
          {...input.fieldProps}
          value={filterValue}
          placeholder="Filter by Date Range"
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent style={{ width: '100%' }}>
          <PopoverArrow />
          <DayPicker
            {...input.dayPickerProps}
            numberOfMonths={isSmallerThan768 ? 1 : 2}
            mode="range"
            onSelect={(range: any) => {
              if (range) {
                setFilter(
                  `${format(range.from, 'MMM dd, yyyy')}-${format(
                    range.to,
                    'MMM dd, yyyy'
                  )}`
                )
              } else {
                setFilter('')
              }
            }}
          />
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
