import { icon } from "leaflet";
import {
    Tent,
    House,
    Mountain,
    Store,
    Utensils,
    Hotel,
    Bed,
    MapPinned ,
    Castle ,
    Leaf ,
    Church ,
    MapPin, 
    Dot,
  } from "lucide-react";

  export const categories = [

    {
      label: "All",
      icon: Dot,
    },
    {
      label: "Culture",
      icon: Castle,
    },
    {
      label: "Nature",
      icon: Leaf ,
    },
    {
      label: "Spots",
      icon: MapPin,
    },
    {
      label: "Markets",
      icon: Store,
    },
    {
      label: "Temples",
      icon: Church,
    },
  ];