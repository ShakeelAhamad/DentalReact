import React from 'react'

const Loader = () => {
    return (
        <>
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        </>
    )
}

export default Loader