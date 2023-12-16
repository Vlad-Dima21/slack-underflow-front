import Authentication from '@components/Authentication';
import React from 'react';

const Login = () => {
  return (
      <Authentication
        route={`${process.env.BACKEND_URL}/user/login`}
        method={'PUT'}
        actionName={'Sign in'}
    />
  )
}

export default Login