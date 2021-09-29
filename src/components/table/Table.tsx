import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from '@chakra-ui/react'
import { Menu, Transition } from '@headlessui/react'
import { merge } from 'lodash'
import Papa from 'papaparse'
import React, { Fragment } from 'react'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { GrDocumentCsv } from 'react-icons/gr'
import {
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiChevronLeft,
  HiChevronRight,
  HiDownload,
  HiSearch,
} from 'react-icons/hi'
import {
  Column,
  Row,
  TableState,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
// @ts-ignore
import { useExportData } from 'react-table-plugins'

import { Button } from '@/components/atoms'
import { classNames } from '@/utils/methods'

// @ts-ignore
function getExportFileBlob({ columns, data, fileType, fileName }) {
  // @ts-ignore
  const headerNames = columns.map((col) => col.exportValue)
  if (fileType === 'csv') {
    const csvString = Papa.unparse({ fields: headerNames, data })
    return new Blob([csvString], { type: 'text/csv' })
  }

  // Other formats goes here
  return false
}

// Define a default UI for filtering
function GlobalFilter<T extends Record<string, unknown>>({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: {
  preGlobalFilteredRows: Row<T>[]
  globalFilter: any
  setGlobalFilter: (filterValue: any) => void
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <div className="relative w-full rounded-md">
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          // eslint-disable-next-line react/no-children-prop
          children={<HiSearch className="" />}
        />
        <Input
          type="search"
          name="search"
          id="search"
          placeholder={`Search ${count} records`}
          value={value || ''}
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
        />
      </InputGroup>
    </div>
  )
}

// @ts-ignore
const ExportRows = ({ exportData }: { exportData: any }) => {
  return (
    <Menu as="div" className="inline-block relative text-left">
      {({ open }) => (
        <>
          <div>
            <Menu.Button className="inline-flex justify-center py-2 px-4 w-full text-sm font-medium  bg-secondary-500 hover:bg-secondary-600 rounded-md border border-secondary-500 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 focus:ring-offset-secondary-200 text-primary-700 shadow-sm focus:outline-none">
              <HiDownload className="mr-2 w-5 h-5" aria-hidden="true" /> Export
            </Menu.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none"
            >
              <div className="py-1">
                <Menu.Item>
                  <div
                    onClick={() => {
                      exportData('csv', true)
                    }}
                    className="cursor-pointer group flex items-center px-4 py-2 text-sm"
                  >
                    <GrDocumentCsv
                      className="mr-3 w-5 h-5  group-hover:"
                      aria-hidden="true"
                    />
                    All rows
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    onClick={() => {
                      exportData('csv', false)
                    }}
                    className="cursor-pointer group flex items-center px-4 py-2 text-sm"
                  >
                    <GrDocumentCsv
                      className="mr-3 w-5 h-5  group-hover:"
                      aria-hidden="true"
                    />
                    Filtered rows
                  </div>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

interface TableOptions<T> {
  onRowClick?: (row: T) => void
  displayGlobalSearch?: boolean
  displayExportOptions?: boolean
}

// TODO: Empty State

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  initialState,
  options,
}: {
  columns: Column<T>[]
  data: T[]
  initialState?: Partial<TableState<T>>
  options?: TableOptions<T>
}): JSX.Element {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    visibleColumns,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    rows,

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    exportData,
  } = useTable<T>(
    {
      columns,
      data,
      getExportFileBlob,
      initialState,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useExportData
  )

  const DEFAULT_OPTIONS: TableOptions<Record<string, unknown>> = {
    onRowClick: undefined,
    displayGlobalSearch: true,
    displayExportOptions: true,
  }
  const { onRowClick, displayExportOptions, displayGlobalSearch } = merge(
    DEFAULT_OPTIONS,
    options
  )
  // Table UI
  return (
    <>
      <div className="flex space-x-2">
        {displayGlobalSearch && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
        {displayExportOptions && <ExportRows exportData={exportData} />}
      </div>
      {/* table */}
      <div className="py-2">
        <div className="overflow-x-auto sm:rounded-lg border border-gray-300 shadow">
          <div className="inline-block min-w-full align-middle">
            <div className="">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-300"
              >
                <thead className="bg-primary-700">
                  {headerGroups.map((headerGroup) => (
                    <>
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          // Add the sorting props to control sorting.
                          // eslint-disable-next-line react/jsx-key
                          <th
                            scope="col"
                            className="py-4 px-3 text-xs font-medium tracking-wider text-left uppercase min-w-max"
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                          >
                            <div className="group flex justify-between items-center">
                              {column.render('Header')}
                              {/* Add a sort direction indicator */}
                              {!column.disableSortBy && (
                                <span>
                                  {column.isSorted ? (
                                    column.isSortedDesc ? (
                                      <FaSortDown className="w-4 h-4 " />
                                    ) : (
                                      <FaSortUp className="w-4 h-4 " />
                                    )
                                  ) : (
                                    <FaSort className="w-4 h-4  opacity-0 group-hover:opacity-100" />
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          // Add the sorting props to control sorting.
                          // eslint-disable-next-line react/jsx-key
                          <th
                            scope="col"
                            className="px-3 text-xs font-medium tracking-wider text-left  uppercase"
                            {...column.getHeaderProps()}
                          >
                            {column.Filter ? (
                              <div className="pb-2 -mt-2" key={column.id}>
                                {column.render('Filter')}
                              </div>
                            ) : null}
                          </th>
                        ))}
                      </tr>
                    </>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-primary-500 divide-y divide-gray-600"
                >
                  {page.length === 0 ? (
                    <tr role="row">
                      <td
                        className="text-center"
                        colSpan={visibleColumns.length}
                      >
                        No rows found
                      </td>
                    </tr>
                  ) : (
                    page.map((row, idx) => {
                      // new
                      prepareRow(row)
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <tr
                          {...row.getRowProps()}
                          className={classNames(
                            onRowClick
                              ? 'hover:cursor-pointer  hover:bg-gray-100'
                              : ''
                          )}
                          onClick={
                            onRowClick
                              ? () => onRowClick(row.original)
                              : undefined
                          }
                        >
                          {row.cells.map((cell) => {
                            return (
                              // eslint-disable-next-line react/jsx-key
                              <td
                                {...cell.getCellProps()}
                                className="py-3 px-3 text-sm"
                                role="cell"
                              >
                                {cell.render('Cell')}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
              <nav
                className="flex flex-wrap justify-between items-center gap-2 py-3 px-4 bg-primary-700 border-t border-gray-300"
                aria-label="Pagination"
              >
                <div className="flex text-sm font-medium">
                  {rows.length} Results
                </div>
                <label className="flex-1 flex justify-end">
                  <div className="w-max">
                    <span className="sr-only">Items Per Page</span>
                    <Select
                      className="block rounded-md border-gray-300 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      value={state.pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                      }}
                    >
                      {[20, 50, 100, 250, 500].map((pageSize) => (
                        <option
                          className="text-gray-700"
                          key={pageSize}
                          value={pageSize}
                        >
                          {pageSize} rows
                        </option>
                      ))}
                    </Select>
                  </div>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <IconButton
                    aria-label="First"
                    colorScheme="secondary"
                    color="primary.700"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    icon={<HiChevronDoubleLeft />}
                  />

                  <IconButton
                    aria-label="Previous"
                    colorScheme="secondary"
                    color="primary.700"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    icon={<HiChevronLeft />}
                  />
                  <Button>
                    {`Page ${state.pageIndex + 1} of ${pageOptions.length}`}
                  </Button>

                  <IconButton
                    aria-label="Next"
                    colorScheme="secondary"
                    color="primary.700"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    icon={<HiChevronRight />}
                  />
                  <IconButton
                    aria-label="Last"
                    colorScheme="secondary"
                    color="primary.700"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    icon={<HiChevronDoubleRight />}
                  />
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
