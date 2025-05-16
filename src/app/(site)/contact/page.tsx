'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Map,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  Sparkles,
  ArrowRight,
  MessagesSquare,
  PenSquare,
  Headphones,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reset form and show success
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitted(true);
      toast.success('Your message has been sent successfully!');

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white to-slate-50/80">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-lime-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Decorative patterns */}
      <div className="absolute top-40 right-10 opacity-30 hidden lg:block">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="8" fill="rgba(45, 212, 191, 0.2)" />
          <circle cx="60" cy="20" r="8" fill="rgba(45, 212, 191, 0.2)" />
          <circle cx="100" cy="20" r="8" fill="rgba(45, 212, 191, 0.2)" />
          <circle cx="20" cy="60" r="8" fill="rgba(45, 212, 191, 0.2)" />
          <circle cx="60" cy="60" r="8" fill="rgba(45, 212, 191, 0.2)" />
          <circle cx="100" cy="60" r="8" fill="rgba(45, 212, 191, 0.2)" />
          <circle cx="20" cy="100" r="8" fill="rgba(45, 212, 191, 0.2)" />
          <circle cx="60" cy="100" r="8" fill="rgba(45, 212, 191, 0.2)" />
          <circle cx="100" cy="100" r="8" fill="rgba(45, 212, 191, 0.2)" />
        </svg>
      </div>
      <div className="absolute bottom-20 left-10 opacity-30 hidden lg:block">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="8" fill="rgba(59, 130, 246, 0.2)" />
          <circle cx="60" cy="20" r="8" fill="rgba(59, 130, 246, 0.2)" />
          <circle cx="100" cy="20" r="8" fill="rgba(59, 130, 246, 0.2)" />
          <circle cx="20" cy="60" r="8" fill="rgba(59, 130, 246, 0.2)" />
          <circle cx="60" cy="60" r="8" fill="rgba(59, 130, 246, 0.2)" />
          <circle cx="100" cy="60" r="8" fill="rgba(59, 130, 246, 0.2)" />
          <circle cx="20" cy="100" r="8" fill="rgba(59, 130, 246, 0.2)" />
          <circle cx="60" cy="100" r="8" fill="rgba(59, 130, 246, 0.2)" />
          <circle cx="100" cy="100" r="8" fill="rgba(59, 130, 246, 0.2)" />
        </svg>
      </div>

      <div className="container max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-3 sm:mb-4 px-3 py-1 bg-white/80 backdrop-blur-sm border-teal-200 shadow-sm"
            >
              <div className="flex items-center">
                <span className="flex h-5 w-5 items-center justify-center mr-1.5">
                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                Get In Touch
              </div>
            </Badge>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Have questions about our platform? Want to learn more about how blockchain crowdfunding
            works? We&apos;re here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="border-slate-200 shadow-xl hover:shadow-2xl transition-shadow duration-500 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 w-full"></div>
              <CardHeader className="px-5 sm:px-6 pt-6 sm:pt-7 pb-2 sm:pb-3">
                <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-gray-900">
                  <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600" />
                  </div>
                  <span>Send Us a Message</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-slate-500 mt-1">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pt-2 sm:pt-3 pb-6 sm:pb-7">
                {isSubmitted ? (
                  <motion.div
                    className="flex flex-col items-center justify-center py-10 sm:py-12 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="h-16 w-16 sm:h-20 sm:w-20 bg-green-50 rounded-full flex items-center justify-center mb-5 sm:mb-6">
                      <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-medium mb-2 text-gray-900">
                      Message Sent!
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500 max-w-md">
                      Thank you for reaching out. We&apos;ll respond to your inquiry shortly. Check
                      your email for a confirmation.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <motion.div
                      variants={itemVariants}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
                    >
                      <div className="space-y-1.5 sm:space-y-2 relative">
                        <Label htmlFor="name" className="text-sm sm:text-base text-slate-700">
                          Your Name
                        </Label>
                        <div className="relative">
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => handleFocus('name')}
                            onBlur={handleBlur}
                            placeholder="John Doe"
                            required
                            className={`h-10 sm:h-11 pl-9 border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 ${
                              focusedField === 'name'
                                ? 'border-teal-500 ring-4 ring-teal-500/10'
                                : ''
                            }`}
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2 relative">
                        <Label htmlFor="email" className="text-sm sm:text-base text-slate-700">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => handleFocus('email')}
                            onBlur={handleBlur}
                            placeholder="you@example.com"
                            required
                            className={`h-10 sm:h-11 pl-9 border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 ${
                              focusedField === 'email'
                                ? 'border-teal-500 ring-4 ring-teal-500/10'
                                : ''
                            }`}
                          />
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="space-y-1.5 sm:space-y-2 relative"
                    >
                      <Label htmlFor="subject" className="text-sm sm:text-base text-slate-700">
                        Subject
                      </Label>
                      <div className="relative">
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          onFocus={() => handleFocus('subject')}
                          onBlur={handleBlur}
                          placeholder="How can we help you?"
                          required
                          className={`h-10 sm:h-11 pl-9 border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 ${
                            focusedField === 'subject'
                              ? 'border-teal-500 ring-4 ring-teal-500/10'
                              : ''
                          }`}
                        />
                        <PenSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="space-y-1.5 sm:space-y-2 relative"
                    >
                      <Label htmlFor="message" className="text-sm sm:text-base text-slate-700">
                        Message
                      </Label>
                      <div className="relative">
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => handleFocus('message')}
                          onBlur={handleBlur}
                          placeholder="Please describe your question or issue in detail..."
                          required
                          className={`min-h-[140px] sm:min-h-[180px] resize-y pl-9 pt-2 border-slate-300 focus:border-teal-500 focus:ring-teal-500/20 ${
                            focusedField === 'message'
                              ? 'border-teal-500 ring-4 ring-teal-500/10'
                              : ''
                          }`}
                        />
                        <MessagesSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        type="submit"
                        className="w-full h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 shadow-md hover:shadow-lg transition-all group"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                            Send Message
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info Card */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              {/* Company Info Card */}
              <Card className="border-slate-200 shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white z-0"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-100/30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <CardHeader className="px-5 sm:px-6 pt-6 relative z-10">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-teal-500/10 flex items-center justify-center">
                      <Map className="h-4 w-4 text-teal-600" />
                    </div>
                    <span>Our Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 sm:px-6 pb-6 relative z-10">
                  <div className="space-y-5">
                    <div className="flex space-x-3 items-start">
                      <div className="h-9 w-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
                        <Mail className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Email Us</div>
                        <a
                          href="mailto:support@crowdfundify.com"
                          className="text-sm sm:text-base font-medium text-gray-900 hover:text-teal-600 transition-colors"
                        >
                          support@crowdfundify.com
                        </a>
                      </div>
                    </div>

                    <div className="flex space-x-3 items-start">
                      <div className="h-9 w-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
                        <Phone className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Call Us</div>
                        <a
                          href="tel:+11234567890"
                          className="text-sm sm:text-base font-medium text-gray-900 hover:text-teal-600 transition-colors"
                        >
                          +1 (123) 456-7890
                        </a>
                      </div>
                    </div>

                    <div className="flex space-x-3 items-start">
                      <div className="h-9 w-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
                        <Clock className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Working Hours</div>
                        <p className="text-sm sm:text-base font-medium text-gray-900">
                          Monday - Friday: 9AM - 5PM
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="border-slate-200 shadow-lg relative overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-blue-400 w-full"></div>
                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>

                <CardHeader className="px-5 sm:px-6 pt-6 pb-2 sm:pb-3 relative z-10">
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Quick answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-5 sm:px-6 pt-0 pb-5 sm:pb-6 relative z-10">
                  <div className="space-y-3 divide-y divide-slate-100">
                    {[
                      'How secure is blockchain crowdfunding?',
                      'What fees do you charge?',
                      'How quickly can I withdraw funds?',
                    ].map((question, index) => (
                      <div className={`pt-3 ${index === 0 ? '' : 'pt-3'}`} key={index}>
                        <a href="#" className="flex items-center justify-between group">
                          <span className="text-sm text-gray-700 group-hover:text-teal-600 transition-colors font-medium">
                            {question}
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <a
                      href="/faq"
                      className="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors flex items-center"
                    >
                      <span>View all FAQs</span>
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card className="border-slate-200 shadow-lg bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lime-200/30 to-lime-300/20 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>

                <CardContent className="p-5 sm:p-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-5 w-5 text-lime-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        Need Immediate Support?
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        Our support team is ready to help with any urgent questions.
                      </p>
                      <a
                        href="/live-chat"
                        className="inline-flex items-center justify-center px-3.5 py-2 rounded-md text-sm font-medium bg-lime-100 text-lime-700 hover:bg-lime-200 transition-colors"
                      >
                        Start Live Chat
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
