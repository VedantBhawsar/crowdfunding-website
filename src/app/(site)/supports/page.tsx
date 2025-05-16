'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  HelpCircle,
  LifeBuoy,
  Wallet,
  FileQuestion,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  ArrowRight,
  ExternalLink,
  FileText,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'ticket' | 'knowledge' | 'faq'>('ticket');

  // State for the support ticket form
  const [ticketData, setTicketData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    description: '',
    campaignId: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes for category
  const handleCategoryChange = (value: string) => {
    setTicketData(prev => ({ ...prev, category: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call to submit ticket
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reset form and show success message
      setTicketData({
        name: '',
        email: '',
        subject: '',
        category: '',
        description: '',
        campaignId: '',
      });

      setIsSubmitted(true);
      toast.success('Your support ticket has been submitted successfully!');

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error('Failed to submit support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Support categories
  const categories = [
    {
      id: 'account',
      name: 'Account Issues',
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      description: 'Help with login, profile, or account settings',
    },
    {
      id: 'wallet',
      name: 'Wallet & Payments',
      icon: <Wallet className="h-5 w-5 text-primary" />,
      description: 'Issues with wallet connections or payments',
    },
    {
      id: 'campaign',
      name: 'Campaign Questions',
      icon: <FileQuestion className="h-5 w-5 text-primary" />,
      description: 'Help with creating or managing campaigns',
    },
    {
      id: 'rewards',
      name: 'Rewards & Distribution',
      icon: <Lightbulb className="h-5 w-5 text-primary" />,
      description: 'Questions about reward distribution or claims',
    },
    {
      id: 'technical',
      name: 'Technical Support',
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      description: 'Technical issues or bugs on the platform',
    },
    {
      id: 'other',
      name: 'Other',
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      description: 'Any other questions or concerns',
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'How do I create a crowdfunding campaign?',
      answer:
        'To create a campaign, log in to your account, click on "Create Campaign" in the navigation menu, and follow the step-by-step instructions to set up your fundraising page, including details, funding goals, and campaign timeline.',
    },
    {
      question: "What happens if my campaign doesn't reach its funding goal?",
      answer:
        "We offer two funding models: All-or-Nothing and Keep-What-You-Raise. In the All-or-Nothing model, if the campaign doesn't reach its goal, all contributions are automatically returned to backers. In the Keep-What-You-Raise model, creators receive whatever amount was raised, regardless of whether they hit their target.",
    },
    {
      question: 'How are funds distributed after a successful campaign?',
      answer:
        'Funds are released according to your milestone schedule. As you complete and verify each milestone, the corresponding portion of the funds will be released to your connected wallet. This ensures transparency and accountability for both creators and backers.',
    },
    {
      question: 'How do I connect my crypto wallet to the platform?',
      answer:
        'Click the "Connect Wallet" button in the top-right corner of the site, select your wallet provider (MetaMask, WalletConnect, etc.), and follow the prompts to authorize the connection. Your wallet will be used for receiving funds and distributing rewards.',
    },
    {
      question: 'What are the fees for running a campaign?',
      answer:
        'Our platform charges a 5% fee on successfully funded campaigns. There are also gas fees for blockchain transactions that vary based on network congestion. All fees are transparently displayed before you launch your campaign.',
    },
    {
      question: 'How do I distribute rewards to my backers?',
      answer:
        'After your campaign has been successfully funded, you can access the "Rewards" section in your campaign dashboard. From there, you can manage and distribute rewards to backers according to their contribution level. The process is automated through smart contracts.',
    },
    {
      question: 'Can I edit my campaign after it launches?',
      answer:
        'Once a campaign is live, you can edit non-critical details like the description, updates, and images. However, crucial details like funding goals, timeline, and reward structures cannot be changed to maintain trust with backers. Contact support for special circumstances.',
    },
    {
      question: 'What blockchain networks do you support?',
      answer:
        'Currently, we support Ethereum and Polygon networks, with plans to expand to more EVM-compatible chains in the future. You can select your preferred network when creating your campaign.',
    },
  ];

  // Common issues section data
  const commonIssues = [
    {
      title: 'Wallet Connection Problems',
      description: 'Troubleshoot issues connecting your crypto wallet to our platform.',
      link: '#wallet-connection',
    },
    {
      title: 'Campaign Creation Guide',
      description: 'Step-by-step guide to creating an effective crowdfunding campaign.',
      link: '#campaign-creation',
    },
    {
      title: 'Reward Distribution',
      description: 'Learn how to set up and distribute rewards to your backers.',
      link: '#rewards',
    },
    {
      title: 'Milestone Verification',
      description: 'Understanding the milestone verification and fund release process.',
      link: '#milestones',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // Render appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'ticket':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Categories */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Support Categories</CardTitle>
                  <CardDescription>Select a category for your support request</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.map(category => (
                    <div
                      key={category.id}
                      className={`flex items-start p-4 rounded-lg cursor-pointer transition-colors ${
                        ticketData.category === category.id
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-muted border border-transparent'
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <div className="mr-4 mt-0.5">{category.icon}</div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Ticket Form */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will respond as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <motion.div
                      className="flex flex-col items-center justify-center py-12 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                      <h3 className="text-2xl font-medium mb-2">Ticket Submitted!</h3>
                      <p className="text-muted-foreground mb-4 max-w-md">
                        Thanks for reaching out. We&apos;ve received your support request and will
                        respond within 24-48 hours.
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Ticket ID: #{Math.floor(Math.random() * 900000) + 100000}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={ticketData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={ticketData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={ticketData.subject}
                          onChange={handleChange}
                          placeholder="Brief summary of your issue"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="campaignId">Campaign ID (optional)</Label>
                        <Input
                          id="campaignId"
                          name="campaignId"
                          value={ticketData.campaignId}
                          onChange={handleChange}
                          placeholder="If related to a specific campaign"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={ticketData.category}
                          onValueChange={handleCategoryChange}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center">
                                  <span className="mr-2">{category.icon}</span>
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Describe Your Issue</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={ticketData.description}
                          onChange={handleChange}
                          placeholder="Please provide as much detail as possible..."
                          className="min-h-[150px]"
                          required
                        />
                      </div>

                      <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Submitting...
                            </span>
                          ) : (
                            <span className="flex items-center">Submit Support Ticket</span>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        );

      case 'knowledge':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Common Issues</h2>
              <div className="space-y-4">
                {commonIssues.map((issue, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-5">
                      <CardTitle className="text-xl">{issue.title}</CardTitle>
                      <CardDescription>{issue.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="bg-muted p-4 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString()}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={issue.link} className="flex items-center">
                          View Guide <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <h2 className="text-2xl font-bold mt-10 mb-6">Video Tutorials</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center mb-4">
                    <div className="text-center p-6">
                      <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Video tutorial content will be displayed here
                      </p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">
                    Getting Started with Blockchain Crowdfunding
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A comprehensive guide to creating your first campaign and understanding the
                    platform.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Latest Resources</h2>

              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Wallet Connection Guide</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-4">
                    Learn how to connect your cryptocurrency wallet to our platform and troubleshoot
                    common connection issues.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>
                        Step-by-step instructions for MetaMask, WalletConnect, and Coinbase Wallet
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>Solutions for common connection errors</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                      <span>Security best practices for wallet connections</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    asChild
                  >
                    <a href="#">
                      Read Full Guide <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Smart Contract Interaction Explained</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-4">
                    Understanding how our platform&apos;s smart contracts work for campaign funding,
                    milestone verification, and reward distribution.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    asChild
                  >
                    <a href="#">
                      Read Full Guide <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Campaign Creator Handbook</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="mb-4">
                    Everything you need to know about creating, managing, and promoting successful
                    crowdfunding campaigns on our platform.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    asChild
                  >
                    <a href="#">
                      Read Full Guide <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-12 text-center p-6 bg-muted/50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-4">
                Can&apos;t find the answer you&apos;re looking for? Please submit a support ticket.
              </p>
              <Button onClick={() => setActiveTab('ticket')}>Contact Support</Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge variant="outline" className="mb-4 px-3 py-1">
          Support Center
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          How Can We Help You?
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get the support you need with our blockchain crowdfunding platform. Browse our resources
          or submit a ticket for personalized assistance.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        className="max-w-3xl mx-auto mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 h-14 rounded-lg"
          />
          <Button className="absolute right-0 top-0 h-full rounded-l-none px-4">Search</Button>
        </div>
      </motion.div>

      {/* New Tab Navigation */}
      <div className="border-b border-gray-200 mb-12">
        <div className="flex max-w-4xl mx-auto">
          <div
            className={`flex-1 flex justify-center py-4 px-1 border-b-2 cursor-pointer ${activeTab === 'ticket' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('ticket')}
          >
            <div className="flex flex-col items-center">
              <LifeBuoy className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Submit a Ticket</span>
            </div>
          </div>

          <div
            className={`flex-1 flex justify-center py-4 px-1 border-b-2 cursor-pointer ${activeTab === 'knowledge' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('knowledge')}
          >
            <div className="flex flex-col items-center">
              <FileText className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">Knowledge Base</span>
            </div>
          </div>

          <div
            className={`flex-1 flex justify-center py-4 px-1 border-b-2 cursor-pointer ${activeTab === 'faq' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('faq')}
          >
            <div className="flex flex-col items-center">
              <Info className="h-6 w-6 mb-1" />
              <span className="text-sm font-medium">FAQ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {renderContent()}

      {/* Status Section */}
      <div className="bg-muted/30 rounded-lg p-6 text-center mt-16">
        <div className="flex items-center justify-center mb-2">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
          <h3 className="font-medium">All Systems Operational</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Our platform is running smoothly. Check our{' '}
          <a href="#" className="text-primary hover:underline">
            status page
          </a>{' '}
          for more details.
        </p>
      </div>
    </div>
  );
}
