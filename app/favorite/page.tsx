import { fetchFavorite } from "@/actions/actions"
import EmptyList from "@/components/home/EmptyList"
import FavLocation from "@/components/home/FavLocation"


const Favorite = async () => {
  const favorites = await fetchFavorite()
  if (favorites.length === 0) {
    return <EmptyList 
    heading="ไม่พบสถานที่ที่คุณสนใจ"
    
    />
  }
  return <FavLocation Locations={favorites} />

}
export default Favorite