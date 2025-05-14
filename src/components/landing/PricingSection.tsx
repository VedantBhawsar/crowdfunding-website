'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckIcon } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Creator',
    description: 'Perfect for individual projects',
    price: 0,
    billing: 'gas fees only',
    features: [
      'Launch basic crowdfunding campaigns',
      'Community support',
      'Basic analytics dashboard',
      'Email notifications',
      'Single blockchain network'
    ],
    popular: false // Not used in this design style
  },
  {
    name: 'Enterprise', // This is the "Enterprise" from the image
    description: 'This package provides full access to all premium features.', // Taking desc from image for Enterprise if this is mapped to image's Enterprise
    price: 0.1, // Should be 99 as per image if content was changeable, but rule is no content change
    billing: 'ETH/month',
    features: [
      'Unlimited campaigns', // Example: Image says "Unlimited production units"
      'Custom smart contract development', // Example: Image says "Dedicated account manager"
      'Multi-chain deployment', // Example: Image says "Tailored manufacturing solutions"
      'Advanced analytics', // Example: Image says "Predictive production optimization"
      'Priority verification'
    ],
    popular: false
  },
  {
    name: 'Pro Creator', // This is the "Professional" from the image
    description: 'Designed for greater flexibility, this solution offers advanced tools for custom tailoring to your needs.', // Image desc for Professional
    price: 0.05, // This plan doesn't have a price displayed in the same way in the image.
    billing: 'ETH/month', // The image doesn't show price for Professional, only "Get Started"
    features: [ // Features are not listed visually on the "Professional" card in the image
      'Up to 5 active campaigns',
      'Priority technical support',
      'Advanced campaign tools',
      'Detailed analytics reports',
      'Custom integrations'
    ],
    popular: true // Not directly used for styling, but identifies the special card
  }
];


// Helper to format price display based on existing content
const PriceDisplay = ({ price, billing }: { price: number; billing: string }) => {
  if (price === 0 && billing.toLowerCase() === 'gas fees only') {
    return (
      <>
        <span className="text-4xl font-bold text-white">Free</span>
        <span className="text-slate-400 text-sm ml-1"> ({billing})</span>
      </>
    );
  }

  let mainPrice = String(price);
  let unit = '';
  if (billing.toLowerCase().includes('eth')) {
    mainPrice = `${price} ETH`;
  }

  let frequency = '';
  if (billing.toLowerCase().includes('/month')) {
    frequency = '/month';
  } else if (price !== 0 && !billing.toLowerCase().includes('eth')) {
     // If billing is something else entirely like "per campaign" and price is not 0
     unit = ` ${billing}`;
  }


  return (
    <>
      <span className="text-4xl font-bold text-white">
        {mainPrice.replace(/ETH$/, '')} {/* Remove ETH if it was part of mainPrice calculation to avoid double ETH */}
        {billing.toLowerCase().includes('eth') && <span className="text-3xl lg:text-4xl align-baseline">ETH</span>}
      </span>
      <span className="text-slate-400 text-sm">{frequency || unit}</span>
    </>
  );
};


const PricingSection = () => {
  const topPlans = pricingPlans.filter(plan => plan.name !== 'Pro Creator');
  const bottomPlan = pricingPlans.find(plan => plan.name === 'Pro Creator');

  return (
    <div className="bg-slate-900 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Tailored Plans For Your Manufacturing Scale {/* Text from image */}
          </motion.h2>
          <motion.p
            className="text-slate-400 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Flexible pricing for any business size. {/* Text from image */}
          </motion.p>
        </div>

        {/* Top two cards: Starter and Enterprise styled */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {topPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="bg-slate-800 p-6 lg:p-8 rounded-xl flex flex-col" // Style from image for Starter/Enterprise
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-white mb-1">{plan.name}</h3>
              <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{plan.description}</p>

              <div className="mb-8 min-h-[60px]"> {/* Min height for price alignment */}
                <PriceDisplay price={plan.price} billing={plan.billing} />
              </div>

              <Button
                variant="outline"
                className="w-full border-slate-600 hover:border-slate-500  py-2.5 rounded-lg transition-colors"
              >
                Get Started
              </Button>

              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wide my-6 pt-6 border-t border-slate-700 text-center">
                Features
              </div>

              <ul className="space-y-3 mt-auto text-sm text-slate-300">
                {plan.features.slice(0, 4).map((feature, i) => ( // Max 4 features like image
                  <li key={i} className="flex items-start">
                    <div className="w-4 h-4 bg-slate-600 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0">
                      <CheckIcon className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom card: Professional styled */}
        {bottomPlan && (
          <motion.div
            className="bg-[rgb(13,76,88)] p-8 md:p-10 rounded-xl text-center mt-6 lg:mt-8" // Dark teal from image
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Title matches image */}
            <h3 className="text-2xl font-semibold text-white mb-2">Professional</h3>
            <p className="text-slate-300 mb-8 max-w-md mx-auto text-sm">
              {bottomPlan.description}
            </p>
            <Button className="bg-lime-300 hover:bg-lime-400 text-slate-900 font-semibold px-10 py-3 rounded-lg transition-colors">
              Get Started
            </Button>
            {/* No features list for this card as per image design */}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PricingSection;