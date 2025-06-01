import { JSX } from "react/jsx-runtime";


export type actionFunction = (
  previousState: any,
  formData: FormData
) => Promise<{ message: string }>








// Define types for weather data
export type WeatherCondition = {
  main: string;
  description: string;
}

export type MainWeatherData = {
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
}

export type WindData = {
  speed: number;
}

export type SysData = {
  country: string;
}

export type WeatherResponse = {
  name: string;
  weather: WeatherCondition[];
  main: MainWeatherData;
  wind: WindData;
  sys: SysData;
}

// Define type for weather icons
export type WeatherIcons = {
  [key: string]: JSX.Element;
}





export type LocationCardProps = {
  id: string
  name: string,
  image: string | string[],
  description: string,
  category: string,
  districts: string,
  price: string,
  lat: number,
  lng: number,
  rating: number | null,
  openTime: string | null,
  closeTime: string | null,
}