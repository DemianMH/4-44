import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Preloader } from "@/components/Preloader";
import { Sections } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Sections />
      </main>
    </>
  );
}
