import { LocationCardProps } from "@/utils/types"


const OtherInfo = ({ location }: { location: LocationCardProps }) => {
    return (
        <section className="flex">
            <div className="text-white space-y-2 sm:space-y-3">
                <p className="text-sm sm:text-base text-white/80">{location.districts}</p>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight md:leading-[80px]">
                    {location.name}
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-white/90 line-clamp-2 sm:line-clamp-3">
                    {location.description.length > 100 
                        ? location.description.substring(0, 100) + "..." 
                        : location.description
                    }
                </p>
            </div>
        </section>
    )
}
export default OtherInfo