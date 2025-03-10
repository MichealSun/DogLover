import React from "react"
import { grey } from '@mui/material/colors'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CloseTwoTone from '@mui/icons-material/CloseTwoTone'

interface FlyoutProps {
    open: boolean
    children: React.ReactNode
    title?: string
    onApplyFilter: () => void
    onCloseFilter: () => void
}

const Flyout: React.FC<FlyoutProps> = ({
  open,
  title = 'Flyout',
  children,
  onApplyFilter,
  onCloseFilter,
}: FlyoutProps) => {
  const handleCloseFlyout = () => {
    onCloseFilter()
  }

  const borderStyle = `1px solid ${grey[100]}`

  return (
    open && (
      <Paper
        id='dog-lover-flyout'
        elevation={1}
        sx={{
          height: '100vh',
          position: 'fixed',
          zIndex: '10',
          top: '0',
          right: '0',
          minWidth: '20rem',
          maxWidth: '30rem',
          boxSizing: 'border-box'
        }}
      >
        <Box display='flex' flexDirection='column' height='100%'>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            padding='2rem'
            borderBottom={borderStyle}
          >
            <Typography variant='h5'>
              {title}
            </Typography>
            <IconButton
              aria-label={`Close ${title}`}
              size='small'
              onClick={handleCloseFlyout}
            >
              <CloseTwoTone />
            </IconButton>
          </Box>
          <Box
            height='calc(100% - 4.5rem)'
            padding='2rem'
            overflow='auto'
          >
            {children}
          </Box>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='end'
            gap='1rem'
            borderTop={borderStyle}
            padding='2rem'
          >
            <Button variant='outlined' onClick={handleCloseFlyout}>Cancel</Button>
            <Button variant='contained' onClick={onApplyFilter}>Apply</Button>
          </Box>
        </Box>
      </Paper>
    )
  )
}

export default Flyout
