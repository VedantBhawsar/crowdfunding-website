import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className=" flex justify-center  w-full h-full">
      <section className="mt-32 flex flex-col  items-center">
        <h1 className="text-primary text-4xl font-bold">
          Crowdfunding website
        </h1>
        <p className="text-slate-300 w-3/4 text-center mt-3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Non facilis
          qui dicta totam vero natus reprehenderit placeat ducimus excepturi
          sed! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni
          temporibus aperiam soluta voluptate sit officia error, sint
          consequuntur doloribus, ipsa non tenetur, hic quisquam? Pariatur
          molestiae ex praesentium repellendus hic?
        </p>
        <Button variant={"outline"} className="mt-5">
          Start Funding
        </Button>
      </section>
    </main>
  );
}
