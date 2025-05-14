'use client';
import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  TrendingUp,
  MoreVertical,
  BarChartHorizontalBig,
  Briefcase, // Using Briefcase for a generic business/projects icon
  CheckCircle, // Using a simple check circle, or custom one below
} from 'lucide-react';

interface BenefitItemProps {
  title: string;
  description: string;
  delay: number;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ title, description, delay }) => {
  return (
    <motion.div
      className="flex items-start mb-6 last:mb-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
        <Check className="w-3 h-3 text-white" />
      </div>
      <div>
        <h3 className="text-md lg:text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

const benefitsData = [
  {
    title: 'Transparent Funding',
    description:
      'All transactions are recorded on-chain, ensuring every contribution and payout is visible and verifiable by anyone.',
  },
  {
    title: 'Global Backer Access',
    description:
      'Anyone, anywhere can support projects using crypto, breaking down borders and enabling global participation.',
  },
  {
    title: 'Automated & Secure Payouts',
    description:
      'Smart contracts automate fund releases, reducing risk and ensuring creators get paid only when milestones are met.',
  },
];

const KeyBenefitsSection = () => {
  const projectStatuses = [
    { label: 'Funded', percentage: '62%', barWidth: 'w-[80%]' },
    { label: 'Active', percentage: '28%', barWidth: 'w-[60%]' },
    { label: 'Expired', percentage: '10%', barWidth: 'w-[30%]' },
  ];

  const barChartData = [
    { height: 'h-16', color: 'bg-teal-500' },
    { height: 'h-10', color: 'bg-slate-700' },
    { height: 'h-24', color: 'bg-teal-500' },
    { height: 'h-14', color: 'bg-slate-700' },
    { height: 'h-20', color: 'bg-teal-500' },
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 xl:gap-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Left Panel - Dashboard UI */}
          <motion.div className="w-full lg:w-5/12" variants={itemVariants}>
            {/* Top Stats Card (mimicking the background stats part) */}
            <div className="bg-slate-50 rounded-xl p-6 shadow-lg relative z-0 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Total Campaigns</h3>
              </div>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold text-gray-800 mr-2">1475</span>
                <div className="flex items-center text-xs text-green-600 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  <span>+56%</span>
                </div>
              </div>

              {projectStatuses.map(status => (
                <div key={status.label} className="flex items-center text-xs text-gray-500 mb-2.5">
                  <span className="w-1/3 truncate pr-2">{status.label}</span>
                  <div
                    className={`flex-grow h-1.5 bg-gray-200 rounded-sm mx-1 ${status.barWidth}`}
                  ></div>
                  <span className="w-1/6 text-right font-medium text-gray-700">
                    {status.percentage}
                  </span>
                </div>
              ))}
            </div>

            {/* Floating Project Card with Bar Chart */}
            <motion.div className="bg-white rounded-xl p-5 md:p-6 shadow-2xl relative z-10 lg:-mt-10 lg:ml-4 transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="p-2 bg-lime-100 rounded-md mr-2.5">
                    <BarChartHorizontalBig className="w-5 h-5 text-lime-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-600">Campaigns Funded</span>
                  <TrendingUp className="w-3.5 h-3.5 text-green-500 ml-1.5 mr-0.5" />
                  <span className="text-xs text-green-500 font-semibold">+8%</span>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1.5">1951+</div>
              <p className="text-xs text-gray-500 mb-6">
                Increase of <span className="font-semibold text-gray-700">126</span> this month
              </p>

              <div className="flex items-end justify-between h-28 space-x-1.5 px-2">
                {barChartData.map((bar, index) => (
                  <div
                    key={index}
                    className={`w-full rounded-t-sm ${bar.height} ${bar.color} transition-all duration-300 ease-out group-hover:opacity-75`}
                  ></div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel - Benefits List */}
          <motion.div className="w-full lg:w-7/12 mt-8 lg:mt-0" variants={itemVariants}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight">
              Key Benefits of Decentralized Crowdfunding
            </h2>
            <p className="text-gray-600 mb-8 lg:mb-10 text-base">
              Our platform empowers creators and backers with transparency, security, and global
              reach through blockchain technology.
            </p>

            <div>
              {benefitsData.map((benefit, index) => (
                <BenefitItem
                  key={benefit.title}
                  title={benefit.title}
                  description={benefit.description}
                  delay={0.2 + index * 0.15} // Staggered delay for each benefit item
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyBenefitsSection;
