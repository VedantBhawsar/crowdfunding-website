"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme } = useTheme();
  return (
    <main className=" flex justify-center w-full h-full">
      <section className="mt-32 flex flex-col  items-center">
        <h1 className="text-primary text-4xl font-bold">
          Crowdfunding website
        </h1>
        <p className=" w-3/4 text-center mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non facilis
          qui dicta totam vero natus reprehenderit placeat ducimus excepturi
          sed! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni
          temporibus aperiam soluta voluptate sit officia error, sint
          consequuntur doloribus, ipsa non tenetur, hic quisquam? Pariatur
          molestiae ex praesentium repellendus hic?
        </p>
        <Button variant={"outline"} className="mt-5" onClick={() => {}}>
          Start Funding
        </Button>

        <Button onClick={() => setTheme("light")} variant={"outline"}>
          Light
        </Button>
        <Button onClick={() => setTheme("dark")}>Dark</Button>
        <Button onClick={() => setTheme("system")}>System</Button>
      </section>
    </main>
  );
}
