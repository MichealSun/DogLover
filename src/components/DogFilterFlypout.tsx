import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CheckboxFilter from './CheckboxFilter'
import Flyout from './Flyout'

interface DogFilterFlyoutProps {
    open: boolean
    breedsOptions: string[]
    breeds,
    zipCodes,
    minAge,
    maxAge
    appyFilter: (breeds: string[], zipCodes: string[], minAge: string, maxAge: string) => void
    toggleFlyout: (isOpen: boolean) => void
}

const DogFilterFlyout: React.FC<DogFilterFlyoutProps> = ({
  open,
  breedsOptions,
  breeds: breedsProps,
  zipCodes: zipCodesProps,
  minAge: minAgeProps,
  maxAge: maxAgeProps,
  appyFilter,
  toggleFlyout,
}: DogFilterFlyoutProps) => {
  const [breedFilters, setBreedFilters] = useState<string[]>(breedsProps)
  const [zipCodeFilters, setZipCodeFilters] = useState<string[]>(zipCodesProps)
  const [minAgeFilter, setMinAgeFilter] = useState<string>(minAgeProps)
  const [maxAgeFilter, setMaxAgeFilter] = useState<string>(maxAgeProps)
  const [ageError, setAgeError] = useState<string>('')
  
  useEffect(() => {
    setBreedFilters(breedsProps)
    setZipCodeFilters(zipCodesProps)
    setMinAgeFilter(minAgeProps)
    setMaxAgeFilter(maxAgeProps)
  }, [breedsProps, zipCodesProps, minAgeProps, maxAgeProps])

  const handleBreedFilter = (breeds: string[]) => {
    setBreedFilters(breeds)
  }
  
  const handleZipCodeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    if (!value.length) {
      setZipCodeFilters([])
    } else {
      setZipCodeFilters(value.split(','))
    }
  }
  
  const handleMinAgeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    if (maxAgeFilter && value > maxAgeFilter) {
      setAgeError('Min age can not larger than max age')
    }else {
      setAgeError('')
    }
    setMinAgeFilter(value)
  }
  
  const handleMaxAgeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event
    if (minAgeFilter && value < minAgeFilter) {
      setAgeError('Min age can not larger than max age')
    } else {
      setAgeError('')
    }
    setMaxAgeFilter(value)
  }

  const handleApplyFilter = () => {
    toggleFlyout(false)
    appyFilter(breedFilters, zipCodeFilters, minAgeFilter, maxAgeFilter)
  }

  const handleResetFilter = () => {
    setBreedFilters([])
    setZipCodeFilters([])
    setMinAgeFilter('')
    setMaxAgeFilter('')
  }
    
  return (
    <Flyout
      title='Dog filter'
      open={open}
      onApplyFilter={handleApplyFilter}
      onCloseFilter={() => toggleFlyout(false)}
    >
      <Box
        width='20rem'
        display='flex'
        flexDirection='column'
        gap='1rem'
      >
        <CheckboxFilter
          label='Breeds'
          placeholder='Select breeds'
          limitTags={4}
          options={breedsOptions}
          selectedOptions={breedFilters}
          disableCloseOnSelect
          onChange={handleBreedFilter}
        />
        <TextField
          onChange={handleZipCodeFilter}
          label="Zip codes"
          placeholder='Enter zip codes, separate by comma'
          value={zipCodeFilters.join(',')}
        />
        <TextField
          error={!!ageError}
          helperText={ageError}
          onChange={handleMinAgeFilter}
          label="Min age"
          placeholder='Enter a min age'
          value={minAgeFilter}
          type='number'
        />
        <TextField
          error={!!ageError}
          helperText={ageError}
          onChange={handleMaxAgeFilter}
          label="Max age"
          placeholder='Enter a max age'
          value={maxAgeFilter}
          type='number'
        />
        <Button
          onClick={handleResetFilter}
          variant='text'
          sx={{ alignSelf: 'end' }}
        >
          Reset
        </Button>
      </Box>
    </Flyout>
  )
}

export default DogFilterFlyout