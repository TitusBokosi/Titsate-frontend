
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
        <div className="about-section  md:mx-10 lg:mx-40 py-20 flex flex-col gap-5 border-b-2 mx-5">
            <h2 className="text-center">How it works</h2>
          <div className="about-cards  flex gap-5 md:flex-row flex-col">
              {data.map((item, index) => (
                <AboutCard key={index} title={item.title} description={item.description} icon={item.icon} />
            ))} </div>
            
        </div>
    )
}
    