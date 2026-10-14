import React from 'react'

const HeroSection = ({pageTitle,title}) => {
    return (
        <>
            {/* Hero Section */}
            <section className="relative z-0  bg-[url('/images/carousel-1.jpg')] bg-cover bg-center bg-no-repeat py-25 text-white">
                <div className="absolute inset-0 bg-indigo-950/85"></div>
                <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
                    <h1 className="mb-4 text-4xl font-bold sm:text-5xl lg:text-6xl">
                        {pageTitle}
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <a href='#' className="text-lg transition hover:text-blue-200">
                            Home
                        </a>
                        <span>/</span>
                        <span className="text-lg">{title}</span>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HeroSection