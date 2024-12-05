'use client';
import { motion } from "framer-motion";
import { ShieldIcon, StarIcon, LockIcon, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: LockIcon,
      title: "End-to-end Encryption",
      description: "Cutting-edge encryption protects every transaction"
    },
    {
      icon: CheckCircle2Icon,
      title: "Decentralized Verification",
      description: "Blockchain ensures transparent, tamper-proof records"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-7"
        >
          <div className="flex items-center space-x-4">
            <ShieldIcon className="w-14 h-14 text-green-600 bg-green-100 p-2 rounded-full" />
            <h2 className="text-4xl font-bold text-gray-900">
              Uncompromised Security
            </h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Our blockchain-powered platform delivers unparalleled security and transparency, protecting your investments with state-of-the-art technology.
          </p>
          
          <div className="space-y-4">
            {securityFeatures.map((feature) => (
              <div 
                key={feature.title} 
                className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <feature.icon className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">
            Explore Security Measures
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-2">
            <div className="bg-green-50 p-6 text-center border-r border-green-100">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-4xl font-bold text-green-600 mb-2">99.9%</h3>
                <p className="text-gray-600 font-medium">Fund Security</p>
              </motion.div>
            </div>
            <div className="bg-green-50 p-6 text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                <h3 className="text-4xl font-bold text-green-600 mb-2">$0</h3>
                <p className="text-gray-600 font-medium">Fraud Losses</p>
              </motion.div>
            </div>
          </div>
          <div className="p-6 bg-white border-t border-gray-100">
            <p className="text-center text-gray-600 text-sm">
              Backed by advanced blockchain technology and rigorous security protocols
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}