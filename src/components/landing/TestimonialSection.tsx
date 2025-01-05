"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { HeaderText } from "../ui/headerText";

export const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      project: "Green Tech Startup",
      quote:
        "Our sustainable energy project went from concept to reality thanks to this incredible platform!",
      image:
        "https://plus.unsplash.com/premium_photo-1661768742069-4de270a8d9fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Nehali jaiswal",
      project: "Community Art Initiative",
      quote:
        "Blockchain crowdfunding made it easy to connect with supporters who believe in our vision.",
      image: "/nehali.jpg",
    },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <HeaderText
          title="Success Stories"
          description="Real creators, real impact, real success"
        />
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6 space-y-6">
                  <p className="text-lg md:text-xl italic text-muted-foreground">
                  &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-12 w-12 object-cover rounded-full"
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.project}
                      </p>
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
};
