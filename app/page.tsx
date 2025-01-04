import Image from "next/image";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { Analysis } from "./components/Analysis";

export default function Home() {
	return (
		<main className="min-h-screen">
			<Header />
			<Hero />
			<Analysis />
			<Footer />
		</main>
	);
}
