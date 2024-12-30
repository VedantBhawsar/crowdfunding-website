'use client';
import { motion } from "framer-motion";
import { ShieldIcon, LockIcon, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: LockIcon,
      title: "End-to-end Encryption",
      description: "Military-grade encryption protects every transaction and user data point"
    },
    {
      icon: CheckCircle2Icon,
      title: "Decentralized Verification",
      description: "Blockchain technology ensures transparent, immutable, and tamper-proof records"
    }
  ];

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center space-x-6">
            <ShieldIcon className="w-16 h-16 text-indigo-600 bg-indigo-100 p-3 rounded-full shadow-md" />
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              Uncompromised Security
            </h2>
          </div>
          <p className="text-xl text-gray-700 leading-relaxed">
            Our advanced blockchain-powered platform delivers unprecedented security and transparency, providing an ironclad shield for your investments and personal information.
          </p>
          
          <div className="space-y-6">
            {securityFeatures.map((feature) => (
              <div 
                key={feature.title} 
                className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all group border border-gray-200"
              >
                <div className="bg-indigo-50 p-3 rounded-full group-hover:bg-indigo-100 transition-colors">
                  <feature.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white  rounded-lg shadow-md hover:shadow-lg transition-all">
            Explore Security Measures
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-2 bg-indigo-50">
            {[
              { value: "99.9%", label: "Fund Security", delay: 0 },
              { value: "$0", label: "Fraud Losses", delay: 0.2 }
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  delay: stat.delay 
                }}
                className="p-8 text-center border-r last:border-r-0 border-indigo-100"
              >
                <h3 className="text-5xl font-bold text-indigo-600 mb-3">
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium uppercase tracking-wide text-sm">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="p-8 bg-white border-t border-gray-100 text-center">
            <p className="text-gray-600 text-base">
              Backed by cutting-edge blockchain technology and comprehensive security protocols
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}