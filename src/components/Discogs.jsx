const Discogs = async (bandName) => {

    const cityCode = await getCityId(city, state)
    try {
        const response = await fetch(`https://www.jambase.com/jb-api/v1/events?artistName=${bandName}&geoCityId=${cityCode}&apikey=${import.meta.env.VITE_REACT_APP_JAMBASE}`);
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        const jsonifiedresponse = await response.json();
        return jsonifiedresponse.events;
    } catch (error) {
        throw new Error(error.message);
    }
};
