import React from 'react'

const DropdownList = ({parent, children, className}) => {
  return (
      <div className={`${className || ''} dropdown`}>
          {parent}
          <div className='dropdown-content'>
              {children}
          </div>
    </div>
  )
}

export default DropdownList