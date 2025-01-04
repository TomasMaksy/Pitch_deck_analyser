
import Logo from '@/app/assets/logo.png';
import { Menu } from 'lucide-react';

import Image from "next/image";

export const Header = () => {
    return (
        <header className='sticky top-0 backdrop-blur-sm z-20'>
        <div className='flex justify-center items-center bg-black text-white py-1 gap-3'>
            <p className='hidden md:block'>Pitch Deck Checker</p>
            <div className="flex justify-center items-center py-3 bg-black text-white">
                <p className='text-white/60'>Tomas Maksimovic App Submission</p>
            </div>
        </div>


        <div className='py-5'>
            <div className='container'>
                <div className='flex items-center justify-between'>
                <Image src={Logo} alt="Contrarian Ventures Logo" height={40} />
                <Menu className='h-5 w-5 md:hidden'/>
                <nav className='hidden md:flex gap-6 text-black/60 items-center'>
                    <a href='#'>Help</a>
                    <button className='bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex align-items justify-center tracking-tight'>History</button>
                </nav>
                </div>
            </div>
        </div>
        </header>
    );
}