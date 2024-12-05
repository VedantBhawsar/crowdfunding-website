'use client'
import {motion} from 'framer-motion'


export const TestimonialSection = () => {
    const testimonials = [
      {
        name: "Sarah Johnson",
        project: "Green Tech Startup",
        quote: "Our sustainable energy project went from concept to reality thanks to this incredible platform!",
        image: "/api/placeholder/80/80"
      },
      {
        name: "Mike Rodriguez",
        project: "Community Art Initiative",
        quote: "Blockchain crowdfunding made it easy to connect with supporters who believe in our vision.",
        image: "/api/placeholder/80/80"
      }
    ];
  
    return (
      <section className="py-16 bg-white">
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
                    className="w-16 h-16 rounded-full mr-4"
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