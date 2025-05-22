export async function getWeatherData(city) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  // console.log('API Key:', apiKey);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=th&appid=${apiKey}`;
  // console.log('Fetching URL:', url);

  const res = await fetch(url,
    {
      next: { revalidate: 60 },
    }
  )
  if (!res.ok) {
    // console.error('Weather API Error:', res.status, res.statusText);
    throw new Error("ไม่สามารถโหลดข้อมูลอากาศได้");
  }

  const data = await res.json();
  // console.log('Weather Data:', data);
  return data;
}
