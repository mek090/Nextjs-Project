import { LocationCardProps } from "@/utils/types"


const OtherInfo = ({ location }: { location: LocationCardProps }) => {
    return (
        <section className="flex">

            <div className="text-white">
                <p>{location.districts}</p>
                <p className="text-4xl font-semibold md:my-3 md:text-6xl md:leading-[80px]"> {location.name}</p>
                <p className="text-lg">{location.description.substring(0, 100)}</p>
            </div>
        </section>
    )
}
export default OtherInfo