'use client'
import {motion} from 'framer-motion'


export const TestimonialSection = () => {
    const testimonials = [
      {
        name: "Sarah Johnson",
        project: "Green Tech Startup",
        quote: "Our sustainable energy project went from concept to reality thanks to this incredible platform!",
        image: "https://plus.unsplash.com/premium_photo-1661768742069-4de270a8d9fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        name: "Nehali jaiswal",
        project: "Community Art Initiative",
        quote: "Blockchain crowdfunding made it easy to connect with supporters who believe in our vision.",
        image: "/nehali.jpg"
      }
    ];
  
    return (
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real creators, real impact, real success
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, translateY: 20 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-50 p-6 rounded-xl border-2"
              >
                <p className="text-xl italic text-gray-700 mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.project}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  };