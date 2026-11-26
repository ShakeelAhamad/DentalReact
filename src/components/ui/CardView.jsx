import React from 'react'

const CardView = ({icon,title,bg,color,value}) => {
    const Icon = icon;
  return (
    <div
    className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-5"
    >
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {title}
            </span>

            <div className={`rounded-lg p-2 ${bg}`}>
                <Icon size={20} className={color} />
            </div>
        </div>
        <p className={`mt-3 text-2xl font-bold ${color}`}>
            {value}
        </p>
    </div>
  )
}

export default CardView