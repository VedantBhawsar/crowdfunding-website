"use client";
import { motion } from "framer-motion";
import { RocketIcon, UsersIcon, WalletIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Create Campaign",
      description:
        "Develop a compelling project proposal that outlines clear objectives and presents a powerful narrative.",
      icon: RocketIcon,
      color: "text-indigo-500 bg-indigo-50",
    },
    {
      title: "Attract Backers",
      description:
        "Engage potential supporters through transparent communication and platform tools.",
      icon: UsersIcon,
      color: "text-green-500 bg-green-50",
    },
    {
      title: "Get Funded",
      description:
        "Receive blockchain-verified funding directly from your global community of supporters.",
      icon: WalletIcon,
      color: "text-orange-500 bg-orange-50",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            How Our Platform Works?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your innovative ideas into reality through a simple,
            transparent, and powerful crowdfunding process
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="bg-white rounded-lg border shadow-sm hover:shadow transition-all duration-300 overflow-hidden"
            >
              <Card className="">
                <CardHeader>
                  <div
                    className={`flex justify-start w-fit  items-center p-4 px-5 rounded-full ${step.color} inline-block`}
                  >
                    <step.icon
                      className={`w-5 h-5  mr-2 font-bold ${
                        step.color.split(" ")[0]
                      }`}
                      strokeWidth={1.5}
                    />
                    <h3 className={`text-xl  ${step.color}`}>{step.title}</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="bg-gray-50 mt-3 ">
                    <div className="text-base font-medium text-gray-500">
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
