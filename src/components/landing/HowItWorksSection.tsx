"use client";
import { motion } from "framer-motion";
import { RocketIcon, UsersIcon, WalletIcon } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Create Campaign",
      description:
        "Set up your project, define goals, and create a compelling story.",
      icon: RocketIcon,
    },
    {
      title: "Attract Backers",
      description:
        "Share your vision and engage potential supporters through our platform.",
      icon: UsersIcon,
    },
    {
      title: "Get Funded",
      description:
        "Receive transparent, blockchain-verified funding directly from supporters.",
      icon: WalletIcon,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            How Our Platform Works
          </h2>
          <p className="text-xl text-gray-600">
            A simple, transparent process to turn your ideas into reality
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.2,
                duration: 0.5,
              }}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="flex justify-center mb-4">
                <step.icon
                  className="w-12 h-12 text-blue-500"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
