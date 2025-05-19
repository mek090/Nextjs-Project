export async function getWeatherData(city) {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=th&appid=${apiKey}`;
  
    const res = await fetch(url);
    if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลอากาศได้");
  
    return res.json();
  }
  