import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button variant={"outline"}>Button</Button>
      <Button variant={"destructive"}>Button</Button>
      <Button variant={"ghost"}>Button</Button>
      <Button variant={"link"}>Button</Button>
      <Button variant={"default"}>Button</Button>
      <Button variant={"secondary"}>Button</Button>
    </main>
  );
}
