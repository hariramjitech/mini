import React from 'react'

const Footer_bottom = () => {
    return (
        <footer className="bg-white rounded-lg shadow-sm m-4" role="contentinfo">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a 
                        href="/" 
                        className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse group"
                        aria-label="BuildSpace Home"
                    >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                            <img src="/logo.png" alt="" className="w-full h-full object-cover" aria-hidden="true" />
                        </div>
                        <span className="self-center text-2xl font-black whitespace-nowrap tracking-widest uppercase text-zinc-900">BuildSpace</span>
                    </a>
                    <nav aria-label="Footer Navigation">
                        <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0">
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6" aria-label="Learn more about BuildSpace">About</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6" aria-label="Read our Privacy Policy">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline me-4 md:me-6" aria-label="Licensing information">Licensing</a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline" aria-label="Contact support or sales">Contact</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
                <div className="text-sm text-gray-500 sm:text-center">
                    <span>© 2026 <a href="/" className="hover:underline tracking-widest uppercase font-bold" aria-label="BuildSpace Home">BuildSpace™</a>. All Rights Reserved.</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer_bottom;
