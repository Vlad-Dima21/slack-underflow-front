import React from 'react';
import Link from 'next/link';

const AccountForm = ({action, credentials, setCredentials, handleAction, actionInProgress, actionResult}) => {
  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{action}</span>
      </h1>
      <form
        onSubmit={handleAction}
        className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'
      >
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Username
          </span>
          <input
            value={credentials.userName}
            onChange={e => setCredentials(cred => ({ ...cred, userName: e.target.value }))}
            placeholder='Enter username'
            required
            className='form_input'
          />
        </label>
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Password {` `}
          </span>
          <input
            type='password'
            value={credentials.password}
            onChange={e => setCredentials(cred => ({ ...cred, password: e.target.value }))}
            placeholder='Enter password'
            required
            className='form_input'
          />
        </label>
        <div className='flex justify-between align-middle mx-3 mb-5 gap-4'>
          <span className={`rounded px-2 py-1 text-red-500`}>{actionResult || ''}</span>
          <button
            type='submit'
            disabled={actionInProgress}
            className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
          >
            {actionInProgress ? `${action}...` : action}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AccountForm