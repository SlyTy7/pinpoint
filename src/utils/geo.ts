export const getCityFromCoords = async (lat: number, lng: number): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
  );
  const data = await res.json();
  return data.results[0]?.components?.city ?? "Unknown";
};
