import React from 'react'

const Button = ({title,px,py}) => {
  return (
    <button 
    className={
        `bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-600/90 transition-colors cursor-pointer px-${px} py-${py}`
    }
    >
        {title}
    </button>
  )
}

export default Button