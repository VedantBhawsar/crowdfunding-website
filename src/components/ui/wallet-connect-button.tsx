// components/WalletConnectButton.tsx
"use client";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Wallet } from "lucide-react";

export default function WalletConnectButton({
  className,
}: {
  className: string;
}) {
  function handleClick() {}

  return <appkit-button />;

  return (
    <Button onClick={handleClick} className={cn(className)}>
      <Wallet className="w-6 h-6 mr-2" />
      Connect Wallet
    </Button>
  );
}
