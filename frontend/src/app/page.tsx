import { Hero } from '../components/Hero';
import { Stats } from '../components/Stats';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { Testimonials } from '../components/Testimonials';

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}
