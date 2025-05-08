import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 text-center bg-gradient-to-b from-gray-950 via-gray-950 to-transparent">
      <div className="absolute inset-0 opacity-10 bg-grid-pattern"></div>
      <div className="container px-4 md:px-8 relative z-10 mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
          Invest in Highly Vetted Startups
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-6">
          190% year-over-year growth. $450M raised. Invest in the leading equity crowdfunding
          platform. You can now own a piece of your favorite startup with ease.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            Investment Opportunities
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-600 hover:bg-gray-800 hover:text-white px-8 py-3"
          >
            Find Investors
          </Button>
        </div>
      </div>{' '}
    </section>
  );
}
