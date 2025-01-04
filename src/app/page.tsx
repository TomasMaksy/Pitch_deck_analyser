import Image from "next/image";
import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { Footer } from "@/app/components/Footer";
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