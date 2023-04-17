import React from 'react'
import Head from 'next/head'
import Nav from './Nav'
import { UserProvider } from '@/lib/authContext';

const Layout = ({user,loading=false,children}) => (
    <UserProvider value={{user,loading}} >  
    <Head>
        <title>Film database</title>
    </Head>

    <Nav />
    <main className='px-4'>
        <div className='flex justify-center items-center mx-auto bg-white rounded-lg w-2/4 my-16 p-16'>
            <div className='text-2xl font-medium'>{children}</div>
        </div>
    </main>
    </UserProvider>
);

export default Layout