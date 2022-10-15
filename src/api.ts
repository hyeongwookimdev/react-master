const API_KEY = "f346520ba452706de7caceee9bc65f64";
const BASE_PATH = "https://api.themoviedb.org/3";

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&region=kr`
  ).then((response) => response.json());
}
