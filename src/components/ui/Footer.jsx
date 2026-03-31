import React from 'react'

const Footer_bottom = () => {
    return (
        <div>



            <footer class="bg-white rounded-lg shadow-sm dark:bg-gray-900 m-4">
                <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                    <div class="sm:flex sm:items-center sm:justify-between">
                        <a href="/" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse group">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
                                <img src="/logo.png" alt="BuildSpace logo" className="w-full h-full object-cover" />
                            </div>
                            <span class="self-center text-2xl font-black whitespace-nowrap dark:text-white tracking-widest uppercase">BuildSpace</span>
                        </a>
                        <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                            <li>
                                <a href="#" class="hover:underline me-4 md:me-6">About</a>
                            </li>
                            <li>
                                <a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#" class="hover:underline me-4 md:me-6">Licensing</a>
                            </li>
                            <li>
                                <a href="#" class="hover:underline">Contact</a>
                            </li>
                        </ul>
                    </div>
                    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                    <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="/" class="hover:underline tracking-widest uppercase font-bold">BuildSpace™</a>. All Rights Reserved.</span>
                </div>
            </footer>


        </div>
    )
}

export default Footer_bottom



