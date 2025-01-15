"use client";

import Logo from "@/app/assets/logo.png";

import Image from "next/image";

export const Header = () => {
	// Scroll function
	const scrollToAnalysis = () => {
		const analysisSection = document.getElementById("analysis-section");
		if (analysisSection) {
			const yOffset = -140; // Leave 50px above
			const yPosition =
				analysisSection.getBoundingClientRect().top + window.scrollY + yOffset;
			window.scrollTo({ top: yPosition, behavior: "smooth" });
		}
	};

	return (
		<header className="sticky top-0 backdrop-blur-sm z-20">
			<div className="flex justify-center items-center bg-black text-white py-1 gap-3">
				<p className="hidden md:block">Pitch Deck Analyser</p>
				<div className="flex justify-center items-center py-3 bg-black text-white">
					<p className="text-white/60">Tomas Maksimovic WebApp Submission</p>
				</div>
			</div>

			<div className="py-5">
				<div className="container">
					<div className="flex items-center justify-between">
						<Image src={Logo} alt="Contrarian Ventures Logo" height={30} />
						{/* <Menu className="h-5 w-5 md:hidden" /> */}
						<nav className="flex gap-6 text-black/60 items-center">
							<button className="custom-btn-hover">
								<a onClick={scrollToAnalysis}>Try it out</a>
							</button>
							<button className="bg-black text-white px-4 py-2 rounded-lg font-medium inline-flex align-items justify-center tracking-tight">
								About
							</button>
						</nav>
					</div>
				</div>
			</div>
		</header>
	);
};
