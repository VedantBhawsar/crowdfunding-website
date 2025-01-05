"use client";
import { motion } from "framer-motion";
import { RocketIcon, UsersIcon, WalletIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HeaderText } from "../ui/headerText";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Create Campaign",
      description:
        "Develop a compelling project proposal that outlines clear objectives and presents a powerful narrative.",
      icon: RocketIcon,
      variant: "primary",
    },
    {
      title: "Attract Backers",
      description:
        "Engage potential supporters through transparent communication and platform tools.",
      icon: UsersIcon,
      variant: "success",
    },
    {
      title: "Get Funded",
      description:
        "Build meaningful connections with potential supporters by transparency in communication and leveraging platform tools.",
      icon: WalletIcon,
      variant: "warning",
    },
  ];

  return (
    <section className="py-20">
      <div className="container">
        <HeaderText
          title="How Our Platform Works?"
          description="Transform your innovative ideas into reality through a simple,
            transparent, and powerful crowdfunding process"
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight"></h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"></p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "p-3 rounded-full",
                        "bg-primary/10 text-primary"
                      )}
                    >
                      <step.icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  <div className="bg-muted/50 p-2 rounded-full">
                    <div className="text-sm font-medium text-muted-foreground">
                      Step {index + 1}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
