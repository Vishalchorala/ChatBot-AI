import React from 'react'
import { Outlet } from 'react-router-dom'
import GuestRoute from '../routes/GuestRoute'
import logo from '../assets/logo3.png'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

const AuthLayout = () => {
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <GuestRoute>
                <section className='bg-gradient-to-r from-[#e0ccdc] to-[#46064b] h-dvh flex items-center justify-center p-5'>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className='w-full max-w-6xl'
                    >
                        <div className='grid grid-cols-1 md:grid-cols-2 bg-white rounded-md md:rounded-2xl p-2 sm:p-10 shadow-xl'>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className='flex flex-col justify-center items-center md:border-r-2 border-gray-200 px-4'
                            >
                                <img src={logo} alt="Logo" className='w-45 md:w-120 mb-4' />
                            </motion.div>
                            <Outlet />
                        </div>
                    </motion.div>
                </section>
            </GuestRoute>
        </>
    )
}

export default AuthLayout
