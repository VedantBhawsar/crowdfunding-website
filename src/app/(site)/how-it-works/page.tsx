'use client';

import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  PlusCircle,
  TrendingUp,
  Target,
  Gift,
  Wallet,
  Users,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const steps = [
    {
      id: 1,
      title: 'Create Your Campaign',
      description:
        'Set up your blockchain-powered crowdfunding campaign with details, funding goals, and timeline.',
      icon: <PlusCircle className="h-12 w-12 text-primary" />,
      details:
        'Our platform allows you to create a transparent crowdfunding campaign backed by blockchain technology. Define your funding goals, project timeline, and create compelling content to attract supporters.',
    },
    {
      id: 2,
      title: 'Set Milestones',
      description: 'Break your project into achievable milestones to build trust with backers.',
      icon: <Target className="h-12 w-12 text-primary" />,
      details:
        'Milestones help you organize your project development and give backers confidence in your timeline. Each milestone unlocks a portion of the funds when completed, ensuring accountability.',
    },
    {
      id: 3,
      title: 'Create Rewards',
      description: 'Offer unique rewards to incentivize backers at different contribution levels.',
      icon: <Gift className="h-12 w-12 text-primary" />,
      details:
        'Design attractive reward tiers to encourage different levels of contribution. Each reward can be tokenized, making it tradable on the blockchain and potentially increasing in value over time.',
    },
    {
      id: 4,
      title: 'Launch & Promote',
      description: 'Share your campaign through various channels to reach potential supporters.',
      icon: <TrendingUp className="h-12 w-12 text-primary" />,
      details:
        'Once your campaign is live, promote it through social media, community forums, and your network. Our platform provides tools to track campaign performance and engagement metrics.',
    },
    {
      id: 5,
      title: 'Receive Funding',
      description: 'Collect contributions directly to your wallet as supporters back your project.',
      icon: <Wallet className="h-12 w-12 text-primary" />,
      details:
        'Contributions go directly to a secure smart contract, ensuring transparency and security. Funds are released according to your milestone completion, providing both flexibility for creators and security for backers.',
    },
    {
      id: 6,
      title: 'Update & Engage',
      description: 'Keep backers informed with regular updates on project progress.',
      icon: <Users className="h-12 w-12 text-primary" />,
      details:
        'Maintain backer engagement by posting regular updates about your progress. Transparent communication builds trust and can lead to additional support as your project develops.',
    },
  ];

  const faqs = [
    {
      question: 'How is this different from traditional crowdfunding?',
      answer:
        'Our platform leverages blockchain technology to provide transparent, secure funding with programmable milestones and tokenized rewards. Unlike traditional platforms, we offer lower fees, direct wallet-to-wallet transactions, and immutable record-keeping.',
    },
    {
      question: 'What cryptocurrencies can I use to contribute?',
      answer:
        "Currently, our platform supports Ethereum (ETH) and several ERC-20 tokens. We're continuously working to expand supported cryptocurrencies to provide more options for both creators and backers.",
    },
    {
      question: 'How do milestone-based releases work?',
      answer:
        'When you create a campaign, you can define milestones with specific deliverables. As you complete each milestone, you submit proof, and once verified, the corresponding portion of funds is released to your wallet automatically via smart contracts.',
    },
    {
      question: "What happens if a campaign doesn't reach its funding goal?",
      answer:
        "We offer two funding models: All-or-Nothing and Keep-What-You-Raise. In the All-or-Nothing model, if the campaign doesn't reach its goal, all contributions are automatically returned to backers. In the Keep-What-You-Raise model, creators receive whatever amount was raised, regardless of whether they hit their target.",
    },
    {
      question: 'How are rewards distributed?',
      answer:
        'Rewards are distributed as digital tokens on the blockchain. Once a campaign is successfully funded and rewards are ready for distribution, backers can claim their rewards directly to their connected wallets.',
    },
    {
      question: 'What are the platform fees?',
      answer:
        'Our platform charges a 5% fee on successfully funded campaigns, which is significantly lower than traditional crowdfunding platforms. There are also small network fees for blockchain transactions, which vary based on network congestion.',
    },
  ];

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="outline" className="mb-4 px-3 py-1">
          Blockchain-Powered Crowdfunding
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          How Our Platform Works
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our decentralized crowdfunding platform combines the best of Web3 technology with
          easy-to-use features, making fundraising transparent, secure, and accessible to everyone.
        </p>
      </motion.div>

      {/* Process Flow */}
      <motion.div className="mb-24" variants={containerVariants} initial="hidden" animate="visible">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map(step => (
            <motion.div key={step.id} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="mr-2">
                      {step.id}
                    </Badge>
                    {step.icon}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.details}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        className="mb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our blockchain-based approach offers several advantages over traditional crowdfunding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Transparency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                All transactions are recorded on the blockchain, providing complete transparency and
                immutable records.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Lower Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our decentralized approach means significantly lower platform fees compared to
                traditional crowdfunding sites.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Global Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Anyone with a crypto wallet can contribute to projects, regardless of geographic
                location or banking access.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Milestone-Based Funding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Funds are released as milestones are completed, ensuring accountability and reducing
                risk for backers.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Tokenized Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Project rewards are issued as digital tokens that can be collected, traded, or
                potentially increase in value.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Smart Contract Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Campaign funds are secured by smart contracts rather than being held by platform
                intermediaries.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get answers to common questions about our blockchain crowdfunding platform.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 md:p-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Campaign?</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
          Join thousands of innovators who have successfully funded their projects on our platform.
        </p>
        <motion.a
          href="/campaign/create"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Your Campaign
          <ChevronRight className="ml-2 h-4 w-4" />
        </motion.a>
      </motion.div>
    </div>
  );
}
