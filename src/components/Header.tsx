import React from 'react'
import { useNavigate } from 'react-router'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { blueGrey } from '@mui/material/colors'
import { useAppContext } from '../context/useAppContext'
import { BASE_URL } from '../constant'

const Header: React.FC = () => {
  const { userName } = useAppContext()

  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error(`Logout Error: ${response.status}`)
      }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(err) {
      // logout error handling
    } finally {
      navigate('/')
    }
  }

  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      padding='2rem 4rem'
      sx={{ backgroundColor: blueGrey[50] }}
    >
      <Typography variant='h4'>
        Dog Lover
      </Typography>
      <Box display='flex' gap='1rem' alignItems='center'>
        <Chip
          avatar={<Avatar>{userName.charAt(0).toUpperCase()}</Avatar>}
          label={userName}
        />
        <Button variant='outlined' onClick={handleLogout}>
                Logout
        </Button>
      </Box>
    </Box>
  )
}

export default Header