import React from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField' 
import Checkbox from '@mui/material/Checkbox'

interface CheckboxFilterProps {
    label: string
    options: string[]
    selectedOptions: string[]
    placeholder?: string
    limitTags?: number
    disableCloseOnSelect?: boolean
    onChange: (selected: string[]) => void
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
  label,
  options,
  selectedOptions,
  placeholder,
  limitTags,
  disableCloseOnSelect = false,
  onChange,
}) => {
  const handleSelect = (event: React.SyntheticEvent, value: string[]) => {
    onChange(value)
  }

  return (
    <Autocomplete
      multiple
      limitTags={limitTags}
      disableCloseOnSelect={disableCloseOnSelect}
      options={options}
      value={selectedOptions}
      onChange={handleSelect}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder}/>
      )}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )
      }}
    />
  )
}

export default CheckboxFilter
