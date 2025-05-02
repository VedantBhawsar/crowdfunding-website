'use client';
import { motion } from 'framer-motion';
import { LockIcon, CheckCircle2Icon } from 'lucide-react';
import { HeaderText } from '../ui/headerText';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function SecuritySection() {
  const securityFeatures = [
    {
      icon: LockIcon,
      title: 'End-to-end Encryption',
      description:
        'Each transaction and user data point is safeguarded with the highest level of security, employing military-grade encryption standards.',
    },
    {
      icon: CheckCircle2Icon,
      title: 'Crowdfundify Verification',
      description:
        'Blockchain technology delivers unparalleled transparency, ensuring records that are immutable, secure, and tamper-proof.',
    },
  ];

  return (
    <section className="py-20 ">
      <div className="mx-auto w-full">
        <HeaderText
          title="Uncompromised Security"
          description="Our advanced blockchain-powered platform delivers unprecedented
            security and transparency."
        />
      </div>
      <div>
        <div className="grid grid-cols-2 w-full gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.3 }}
              viewport={{
                once: true,
              }}
              key={index}
              className="z-0"
            >
              <Card className="h-full group transition-shadow hover:border-primary/50">
                <CardHeader>
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="group-hover:text-primary cursor-default">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground cursor-default">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
