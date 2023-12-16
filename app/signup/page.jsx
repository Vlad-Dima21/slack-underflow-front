import Authentication from '@components/Authentication'
import React from 'react'

const SignUp = () => {
  return (
      <Authentication
        route={`${process.env.BACKEND_URL}/user/register`}
        method={'POST'}
        actionName={'Sign up'}
    />
  )
}

export default SignUp