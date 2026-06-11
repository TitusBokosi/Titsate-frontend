import HeroSection from '@/features/home/components/hero-section-one';
import MissionVision from './components/MissionVision';
import Courses from './components/courses';
import HowItWorks from './components/about';

const HomePage = () => {
  return (
    <div>
      <HeroSection></HeroSection>
      <Courses></Courses>
      <MissionVision />
      <HowItWorks></HowItWorks>
    </div>
  );
};

export default HomePage;
