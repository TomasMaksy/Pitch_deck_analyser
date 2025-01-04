import { ArrowRight } from "lucide-react"
import Image from "next/image";

import cogImage from '@/app/assets/cog.png';
import cylinderImage from '@/app/assets/cylinder.png';
import noodleImage from '@/app/assets/noodle.png';
import openAi from '@/app/assets/openai.webp';


export const Hero = () => {
    return <section className="pt-8 pb-30 md:pt-5 md:pb-20 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_90%)] overflow-x-clip">
        
        <div className="container mt-10" >
            <div className="md:flex items-center pb-5">
                <div className="md:w-[478px]">
                    <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg -tracking-tight">
                        GPT4o available
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6">
                        Use LLMs to analyse your pitch decks
                        </h1>
                    <p className="text-xl text-[#010D3E] tracking-tight mt-6">
                        Quickly analyse main points in the pitch deck to see if they meet your criteria by simply uploading a pdf
                        </p>
                
                    <div className="flex gap-5 items-center mt-[30px] ">
                        <button className="px-8 pr-12 custom-btn custom-btn-primary relative flex items-center justify-between group hover:bg-slate-900 duration-300 ">
                            <Image 
                                src={openAi} 
                                alt="OpenAI logo" 
                                className="h-5 w-5 ease absolute left-6 translate-x-0 opacity-100 transition duration-300 group-hover:-translate-x-full group-hover:scale-x-50 group-hover:opacity-0 group-hover:blur-sm"
                            />
                            <span className="ease translate-x-6 transition duration-300 group-hover:-translate-x-1">Use ChatGPT</span>
                            <ArrowRight className="h-5 w-5 ease absolute right-4 translate-x-full scale-x-50 opacity-0 blur-sm transition duration-300 group-hover:translate-x-0 group-hover:scale-x-100 group-hover:opacity-100 group-hover:blur-none" />
                        </button>
                        <button className="custom-btn custom-btn-text gap-1">
                            <span>Use Llama locally</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>


                <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
                    <Image 
                    src={cogImage} 
                    alt="Cog" 
                    className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0" />
                
                    <Image 
                    src={cylinderImage} 
                    alt="Cylinder" 
                    width={220}
                    height={220}
                    className="hidden md:block -top-16 -left-32 md:absolute" />

                    <Image
                    src={noodleImage}
                    alt="Noodle"
                    width={220}
                    height={220}
                    className="hidden lg:block absolute top-[580px] left-[448px] rotate-[20deg]"
                    />
                </div>

                
            </div>
        </div>
    </section>
}