
import AboutCard from "./aboutCard"
import pngegg from "../../../assets/pngegg.png"
export default function HowItWorks() {
    const data = [{
        icon :pngegg,
        title: "Learn",
        description: "how our learning process is \n bhdbfjrfnjbfjdnv jdvjdjvdvhd d vn  \n dhbfdbfubufbhfhbdhvhd h d \n bdbfhbdufbubfu"
    },
    {
        icon :"",
        title: "Projects ",
        description: "how our learning process is \n bhdbfjrfnjbfjdnv jdvjdjvdvhd d vn  \n dhbfdbfubufbhfhbdhvhd h d \n bdbfhbdufbubfu"
    },
    {
        icon :"",
        title: "Earn",
        description: "how our learning process is \n bhdbfjrfnjbfjdnv jdvjdjvdvhd d vn  \n dhbfdbfubufbhfhbdhvhd h d \n bdbfhbdufbubfu"
    },
]
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
    