const API_KEY = "f346520ba452706de7caceee9bc65f64";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  title: string;
}
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getTopMovies() {
  return fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=f346520ba452706de7caceee9bc65f64&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}

export function getPopMovies() {
  return fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=f346520ba452706de7caceee9bc65f64&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}
export function getUpMovies() {
  return fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=f346520ba452706de7caceee9bc65f64&language=ko&page=1&region=kr`
  ).then((response) => response.json());
}
