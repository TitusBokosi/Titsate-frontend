
import AboutCard from "./aboutCard"
import { AcademicCapIcon, CodeBracketIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
export default function HowItWorks() {
const data = [
  {
    icon: AcademicCapIcon,
    title: "Learn",
    description:
      "Master core tech skills through structured, hands-on lessons designed to take you from fundamentals to real-world understanding.",
  },
  {
    icon: CodeBracketIcon,
    title: "Projects",
    description:
      "Apply what you learn by building real-world projects that simulate industry workflows and strengthen your portfolio.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Earn",
    description:
      "Turn your skills into income opportunities by preparing for freelance work, internships, and job-ready development roles.",
  },
];
    return(
        <div className="about-section  md:mx-10 lg:mx-40 py-24 flex flex-col gap-12 border-b-2 mx-5">
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">How It Works</h2>
          <div className="about-cards flex gap-8 md:flex-row flex-col animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              {data.map((item, index) => (
                <AboutCard key={index} title={item.title} description={item.description} icon={item.icon} />
            ))} </div>
            
        </div>
    )
}
    