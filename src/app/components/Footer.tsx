import Logo from '@/app/assets/logo_white.png';
import Image from 'next/image';
import {Instagram, Twitter, Facebook, Linkedin, Youtube} from 'lucide-react';

export const Footer = () => {
    return ( 
        <footer>
            <div className="bg-black text-[#BCBCBC] text-sm py-10 flex flex-col text-center">
                <div className="container">
                    <div className="inline-flex relative before:content=[''] before:top-2 before:w-full before:bg-[linear-gradient(to_right,#F87BFF, #FB92CF, #FFDD9B, #C2F0B1, #2FD8FE)] before:absolute ">
                        <Image src={Logo} height={40} alt="Contrarian Ventures Logo" className="relative"/>
                    </div>
                <div className="flex justify-center gap-16 mt-10">
                    <Instagram className="h-5 w-5" />
                    <Twitter className="h-5 w-5" />
                    <Facebook className="h-5 w-5" />
                    <Linkedin className="h-5 w-5" />
                    <Youtube className="h-5 w-5" />
                </div>

                <div className="flex justify-center mt-10">
                <p>&copy; 2025 Tomas Maksimovic</p>
                </div>
                </div>
            </div>
        </footer>
    );
};