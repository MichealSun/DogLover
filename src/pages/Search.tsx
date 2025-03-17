import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Paper from '@mui/material/Paper'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Modal from '@mui/material/Modal'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'

import { BASE_URL } from '../utils/constant'
import { Dog, Order } from '../types/dog'
import Header from '../components/Header'
import DogFilterFlyout from '../components/DogFilterFlypout'

enum TableCellAlign {
  left = 'left',
  right = 'right',
  center = 'center',
}

interface Column {
  id: keyof Dog
  label: string
  align: TableCellAlign
  isSortable?: boolean
  renderCell?: (dog: Dog, key: string) => React.ReactNode
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Dog) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

const Search: React.FC = () => {
  const navigate = useNavigate()

  const [dogs, setDogs] = useState<Dog[]>([])
  const [total, setTotal] = useState<number>(0)
  const [pageNum, setPageNum] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(25)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Dog>('breed')
  const [selected, setSelected] = useState<string[]>([])
  const [matchDog, setMatchDog] = useState<Dog>()
  const [totalBreed, setTotalBreed] = useState<string[]>([])
  const [breedFilters, setBreedFilters] = useState<string[]>([])
  const [zipCodeFilters, setZipCodeFilters] = useState<string[]>([])
  const [minAgeFilter, setMinAgeFilter] = useState<string>('')
  const [maxAgeFilter, setMaxAgeFilter] = useState<string>('')
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false)

  const [tableLoading, setTableLoading] = useState<boolean>(false)
  const [matchDogGenerating, setMatchDogGenerating] = useState<boolean>(false)

  const columns: readonly Column[] = [
    {
      id: 'img',
      label: 'Image',
      align: TableCellAlign.center,
      renderCell: (data: Dog, key: string) => (
        <img
          src={data[key]}
          width="200"
          alt={`${data.name} picture`}
        />
      )
    },
    {
      id: 'name',
      label: 'Dog Name',
      align: TableCellAlign.center,
      isSortable: true
    },
    {
      id: 'breed',
      label: 'Breed',
      align: TableCellAlign.center,
      isSortable: true
    },
    {
      id: 'age',
      label: 'Age(yrs)',
      align: TableCellAlign.right,
      isSortable: true
    },
    {
      id: 'zip_code',
      label: 'Zip Code',
      align: TableCellAlign.right,
    },
  ]

  const fetchIds = async () => {
    const search = {
      size: `${pageSize}`,
      from: `${pageSize * pageNum}`,
      sort: `${orderBy}:${order}`,
    }

    if (minAgeFilter?.length) {
      search['ageMin'] = minAgeFilter
    }
    if (maxAgeFilter?.length) {
      search['ageMax'] = maxAgeFilter
    }

    const params = new URLSearchParams(search)
    let list = []

    if (breedFilters?.length) {
      breedFilters.forEach((breed) => {
        params.append("breeds", breed)
      })
    }
    if (zipCodeFilters?.length) {
      zipCodeFilters.forEach((zipeCode) => {
        params.append("zipCodes", zipeCode)
      })
    }

    try {
      setTableLoading(true)
      const response = await fetch(`${BASE_URL}/dogs/search?${params}`, {
        method: "GET",
        credentials: 'include'
      })
      if (!response.ok) {
        setTableLoading(false)
        throw new Error(`get dogs Error: ${response.status}`)
      }
      const res = await response.json()
      list = res.resultIds
      setTotal(res.total)
    } catch(err) {
      // TODO: error handling
      console.log(err)
    }

    try {
      const response = await fetch(`${BASE_URL}/dogs`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(list),
        credentials: 'include'
      })
      if (response.status === 401) {
        navigate('/')
        return
      }
      if (!response.ok) {
        setTableLoading(false)
        throw new Error(`get dogs Error: ${response.status}`)
      }
      setDogs(await response.json())
      setTableLoading(false)

    } catch(err) {
      // TODO: error handling
      console.log(err)
    }
  }

  const fetchBreed = async () => {
    try {
      const response = await fetch(`${BASE_URL}/dogs/breeds`, {
        method: "GET",
        credentials: 'include'
      })
      if (response.status === 401) {
        navigate('/')
        return
      }
      setTotalBreed(await response.json())
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchIds() 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageNum,
    orderBy,
    order,
    pageNum,
    pageSize,
    breedFilters,
    zipCodeFilters,
    maxAgeFilter,
    minAgeFilter
  ])

  useEffect(() => {
    fetchBreed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleApplyFilter = (breeds: string[], zipCodes: string[], minAge: string, maxAge: string) => {
    setBreedFilters(breeds)
    setZipCodeFilters(zipCodes)
    setMinAgeFilter(minAge)
    setMaxAgeFilter(maxAge)
    setPageNum(0)
  }

  const handleOpenFilter = (open: boolean) => {
    setIsOpenFilter(open)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = dogs.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const hanleSelectedReset = () => setSelected([])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Dog,
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }
    setSelected(newSelected)
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNum(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10))
    setPageNum(0)
  }

  const handleMatchDog = async () => {
    let matchId = null
    setMatchDogGenerating(true)
    try {
      const response = await fetch(`${BASE_URL}/dogs/match`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selected)
      })
      const result = await response.json()
      matchId = result.match
    } catch (err) {
      console.log(err)
    } finally {
      setMatchDogGenerating(false)
    }

    try {
      if (!matchId) {
        throw new Error(`Can not find match dog`)
      }
      const response = await fetch(`${BASE_URL}/dogs`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([matchId]),
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error(`Match dogs Error: ${response.status}`)
      }
      setSelected([])
      setMatchDog((await response.json())[0])

    } catch(err) {
      console.log(err)
    }
  }

  const handleCloseModal = () => {
    setMatchDog(undefined)
  }

  const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { numSelected } = props
    return (
      <Toolbar
        sx={[
          {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
          },
          numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          },
        ]}
      >
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
            Available dogs
        </Typography>
        {numSelected > 0 && (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} favorite dogs selected
          </Typography>
        )}
        {numSelected > 0 && (
          <Button
            variant="contained"
            sx={{
              flex: '1 0 auto'
            }}
            onClick={handleMatchDog}
            loading={matchDogGenerating}
            loadingPosition='start'
          >
              Generate a matched dog
          </Button>
        )}
        {numSelected > 0 && (
          <Tooltip title="Delete">
            <IconButton onClick={hanleSelectedReset}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        <IconButton
          aria-label='Open dog filter'
          onClick={() => handleOpenFilter(true)}
          color='primary'
          disabled={numSelected > 0}
        >
          <FilterListIcon />
        </IconButton>
      </Toolbar>
    )
  }
  const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { onSelectAllClick, order, orderBy, rowCount, onRequestSort } =
      props
    const createSortHandler =
      (property: keyof Dog) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property)
      }
    
    const isCheckedAll = () => (
      dogs.every(dog => selected.includes(dog.id))
    )

    const isCheckIndeterminate = () => (
      !isCheckedAll() && dogs.some(dog => selected.includes(dog.id))
    )
      
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={isCheckIndeterminate()}
              checked={rowCount > 0 && isCheckedAll()}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {columns.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                disabled={!headCell.isSortable}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }

  return (
    <>
      {!!matchDog && (
        <Modal
          open
          onClose={handleCloseModal}
          aria-labelledby="We found your matched dog"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minWidth: '18rem',
              backgroundColor: '#fff',
              border: '2px solid #fff',
              borderRadius: '0.5rem',
              textAlign: 'center',
              padding: '1rem'
            }}
          >
            <Typography variant="h6">
              We found your matched dog!
            </Typography>
            <div>
              <Typography>
                {matchDog.name}
              </Typography>
              <img
                src={matchDog.img}
                width="200"
                alt={`${matchDog.name} picture`}
              />
            </div>
          </Box>
        </Modal>
      )}
      
      <Header />
      {isOpenFilter && (
        <DogFilterFlyout
          open={isOpenFilter}
          breedsOptions={totalBreed}
          breeds={breedFilters}
          zipCodes={zipCodeFilters}
          minAge={minAgeFilter}
          maxAge={maxAgeFilter}
          appyFilter={handleApplyFilter}
          toggleFlyout={handleOpenFilter}
        />
      )}
      <Paper sx={{ width: 'calc(100% - 8rem)', mb: 2, margin: '1rem 4rem' }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer sx={{ height: 'calc(100vh - 14rem)' }}>
          {tableLoading && (
            <Box position='absolute' top='50%' left='50%'>
              <CircularProgress />
            </Box>
          )}
          {!tableLoading && dogs.length === 0 && (
            <Box display='flex' height='inherit' alignItems='center' justifyContent='center'>
              <Typography>
                Sorry, no dogs available under current filter selections.
              </Typography>
            </Box>
          )}
          {!tableLoading && dogs.length > 0 && (
            <Table
              stickyHeader
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={dogs.length}
              />
              <TableBody>
                {dogs.map((data, index) => {
                  const isItemSelected = selected.includes(data.id)
                  const labelId = `enhanced-table-checkbox-${index}`
    
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, data.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={data.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      {columns.map((tabelCell) => (
                        <TableCell
                          key={`${labelId}-${tabelCell.id}`}
                          align={tabelCell.align}
                        >
                          {tabelCell.renderCell ? (
                            tabelCell.renderCell(data, tabelCell.id)
                          ) : data[tabelCell.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>    
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={total}
          rowsPerPage={pageSize}
          page={pageNum}
          disabled={tableLoading}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  )
}

export default Search