const baseURL = "https://api.deezer.com/search/track"
const CORS = "https://cors-anywhere.herokuapp.com/";

export function searchTracks(query: string) {
    const url = CORS + baseURL + `?q=${query}`;

    return fetch(url)
        .then(res => res.json());
}