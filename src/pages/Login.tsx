import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAppContext } from '../context/useAppContext'
import { BASE_URL } from '../utils/constant'
import { validEmail } from '../utils/helper'

const Login: React.FC = () => {
  const navigate = useNavigate()

  const { updateUserName } = useAppContext()

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userNameErr, setUserNameErr] = useState(false)
  const [userEmailErr, setUserEmailErr] = useState(false)
  const [loginErrMsg, setLoginErrMsg] = useState('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value }} = e
    setUserName(value)
  }

  const handleNameBlur = () => {
    setUserNameErr(!userName)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value }} = e
    setUserEmail(value)
  }

  const handleEmailBlur = () => {
    setUserEmailErr(!validEmail(userEmail))
  }

  const handleLogin = async () => {
    let hasError = false;
    if (!userName) {
      setUserNameErr(true)
      hasError = true
    }

    if (!validEmail(userEmail)) {
      setUserEmailErr(true)
      hasError = true
    }
    
    if (hasError) {
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail
        })
      })
      if (!response.ok) {
        throw new Error(`Login Error: ${response.status}`)
      }

      updateUserName(userName)
      navigate('/search')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(err) {
      // TODO: log error
      setLoginErrMsg('We encountered an error during login. Please try again later.')
    }
  }
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        margin: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
      {loginErrMsg && (
        <Alert variant="outlined" severity="error" sx={{ marginBottom: '2rem' }}>
          {loginErrMsg}
        </Alert>
      )}
      <Typography variant='h4'>
        Welcome to Dog Lover!
      </Typography>
      <TextField
        onChange={handleNameChange} 
        onBlur={handleNameBlur}                                
        required
        error={userNameErr}
        id="username"
        label="Name"
        placeholder='Enter user name...'
        helperText={userNameErr ? 'Please provide your username.' : undefined}
      />
      <TextField
        onChange={handleEmailChange}
        onBlur={handleEmailBlur}                                
        required
        error={userEmailErr}
        type='email'
        id="email"
        label="Email"
        placeholder='Enter user email...'
        helperText={userEmailErr ? 'Please provide a valid email address.' : undefined}
      />
      <Button variant="contained" onClick={handleLogin} sx={{ marginTop: '1rem' }}>Login</Button>
    </Container>
  )
}

export default Login 