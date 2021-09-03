import { classNames } from '@/utils/methods'
import {
  Button,
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
          children={<HiSearch className="text-gray-400" />}
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
            <Menu.Button className="inline-flex justify-center py-2 px-4 w-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-100 shadow-sm focus:outline-none">
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
              className="absolute right-0 mt-2 w-56 bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none"
            >
              <div className="py-1">
                <Menu.Item>
                  <div
                    onClick={() => {
                      exportData('csv', true)
                    }}
                    className={
                      'cursor-pointer group flex items-center px-4 py-2 text-sm'
                    }
                  >
                    <GrDocumentCsv
                      className="mr-3 w-5 h-5 text-gray-400 group-hover:text-gray-500"
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
                    className={
                      'cursor-pointer group flex items-center px-4 py-2 text-sm'
                    }
                  >
                    <GrDocumentCsv
                      className="mr-3 w-5 h-5 text-gray-400 group-hover:text-gray-500"
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
      <div className="flex flex-col py-2">
        <div className="overflow-x-auto sm:rounded-lg border-b border-gray-200 shadow">
          <div className="inline-block min-w-full align-middle">
            <div className=" overflow-hidden">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                    <>
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          // Add the sorting props to control sorting.
                          // eslint-disable-next-line react/jsx-key
                          <th
                            scope="col"
                            className="py-4 px-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
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
                                      <FaSortDown className="w-4 h-4 text-gray-400" />
                                    ) : (
                                      <FaSortUp className="w-4 h-4 text-gray-400" />
                                    )
                                  ) : (
                                    <FaSort className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
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
                            className="px-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
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
                  className="bg-white divide-y divide-gray-200"
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
                            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50',
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
                className="flex justify-between items-center py-3 px-4 bg-white border-t border-gray-200"
                aria-label="Pagination"
              >
                <div className="block">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{rows.length}</span> Results
                  </p>
                </div>
                <div className="flex flex-wrap flex-1 justify-end items-center space-x-2">
                  <div className="flex gap-x-2 items-baseline">
                    <label>
                      <span className="sr-only">Items Per Page</span>
                      <Select
                        className="block w-full rounded-md border-gray-300 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                        value={state.pageSize}
                        onChange={(e) => {
                          setPageSize(Number(e.target.value))
                        }}
                      >
                        {[20, 50, 100, 250, 500].map((pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            {pageSize} rows
                          </option>
                        ))}
                      </Select>
                    </label>
                  </div>
                  <IconButton
                    aria-label="First"
                    colorScheme="gray"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    icon={<HiChevronDoubleLeft />}
                  ></IconButton>

                  <IconButton
                    aria-label="Previous"
                    colorScheme="gray"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    icon={<HiChevronLeft />}
                  ></IconButton>
                  <Button disabled={true} colorScheme="gray">
                    {`Page ${state.pageIndex + 1} of ${pageOptions.length}`}
                  </Button>

                  <IconButton
                    aria-label="Next"
                    colorScheme="gray"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    icon={<HiChevronRight />}
                  ></IconButton>
                  <IconButton
                    aria-label="Last"
                    colorScheme="gray"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    icon={<HiChevronDoubleRight />}
                  ></IconButton>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
