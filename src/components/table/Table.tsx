import { Button, IconButton } from '@chakra-ui/button'
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input'
import { Box, HStack } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import { Select } from '@chakra-ui/select'
import {
  Table as ChakraTable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/table'
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
    <Box position="relative" w="full" borderRadius="none">
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
          borderColor="rgba(255, 255, 255, 0.2)"
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
        />
      </InputGroup>
    </Box>
  )
}

// @ts-ignore
const ExportRows = ({ exportData }: { exportData: any }) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label="Export"
        leftIcon={<HiDownload />}
        pr="6"
      >
        Export
      </MenuButton>
      <MenuList>
        <MenuItem
          icon={<GrDocumentCsv />}
          onClick={() => {
            exportData('csv', true)
          }}
        >
          All rows
        </MenuItem>
        <MenuItem
          icon={<GrDocumentCsv />}
          onClick={() => {
            exportData('csv', false)
          }}
        >
          Filtered rows
        </MenuItem>
      </MenuList>
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
      <HStack spacing="2">
        {displayGlobalSearch && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
        {displayExportOptions && <ExportRows exportData={exportData} />}
      </HStack>
      {/* table */}
      <div className="py-2">
        <div
          style={{
            borderColor: 'rgba(255, 255, 255, 0.2)',
          }}
          className="overflow-x-auto sm:rounded-lg border shadow"
        >
          <div className="inline-block min-w-full align-middle">
            <div className="">
              <ChakraTable
                variant="unstyled"
                {...getTableProps()}
                borderColor="rgba(255, 255, 255, 0.2)"
              >
                <Thead bg="brand.darkBlue1">
                  {headerGroups.map((headerGroup) => (
                    <>
                      <Tr
                        {...headerGroup.getHeaderGroupProps()}
                        key="table-header-group-1"
                      >
                        {headerGroup.headers.map((column) => (
                          // Add the sorting props to control sorting.
                          // eslint-disable-next-line react/jsx-key
                          <Th
                            scope="col"
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
                          </Th>
                        ))}
                      </Tr>
                      <Tr
                        {...headerGroup.getHeaderGroupProps()}
                        key="table-header-group-2"
                      >
                        {headerGroup.headers.map((column) => (
                          // Add the sorting props to control sorting.
                          // eslint-disable-next-line react/jsx-key
                          <Th scope="col" {...column.getHeaderProps()}>
                            {column.Filter ? (
                              <div className="pb-2 -mt-2" key={column.id}>
                                {column.render('Filter')}
                              </div>
                            ) : null}
                          </Th>
                        ))}
                      </Tr>
                    </>
                  ))}
                </Thead>
                <Tbody
                  {...getTableBodyProps()}
                  bg="brand.darkBlue1"
                  border="1px"
                  borderColor="borderColor"
                >
                  {page.length === 0 ? (
                    <Tr role="row">
                      <Td
                        className="text-center"
                        colSpan={visibleColumns.length}
                      >
                        No rows found
                      </Td>
                    </Tr>
                  ) : (
                    page.map((row, idx) => {
                      // new
                      prepareRow(row)
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <Tr
                          {...row.getRowProps()}
                          border="1px"
                          borderColor="borderColor"
                          onClick={
                            onRowClick
                              ? () => onRowClick(row.original)
                              : undefined
                          }
                        >
                          {row.cells.map((cell) => {
                            return (
                              // eslint-disable-next-line react/jsx-key
                              <Td
                                {...cell.getCellProps()}
                                fontSize="sm"
                                role="cell"
                              >
                                {cell.render('Cell')}
                              </Td>
                            )
                          })}
                        </Tr>
                      )
                    })
                  )}
                </Tbody>
              </ChakraTable>
              <nav
                className="flex flex-wrap justify-between items-center gap-2 py-3 px-6 bg-primary-700 border-t border-gray-300"
                aria-label="Pagination"
              >
                <div className="flex text-sm font-medium">
                  {rows.length} Results
                </div>
                <label className="flex-1 flex justify-end">
                  <div className="w-max">
                    <span className="sr-only">Items Per Page</span>
                    <Select
                      value={state.pageSize}
                      fontSize="sm"
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
                  </div>
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <IconButton
                    aria-label="First"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    icon={<HiChevronDoubleLeft />}
                  />

                  <IconButton
                    aria-label="Previous"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    icon={<HiChevronLeft />}
                  />
                  <Button>
                    {`Page ${state.pageIndex + 1} of ${pageOptions.length}`}
                  </Button>

                  <IconButton
                    aria-label="Next"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    icon={<HiChevronRight />}
                  />
                  <IconButton
                    aria-label="Last"
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
