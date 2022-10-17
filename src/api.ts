const API_KEY = "f346520ba452706de7caceee9bc65f64";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface ITv {
  backdrop_path: string;
  first_air_date: string;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}
export interface IMovie {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  title: string;
  genre_ids: number[];
  original_title: string;
  vote_average: number;
  release_date: string;
  vote_count: number;
  popularity: number;
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

export interface IGetGenres {
  genres: [
    {
      id: number;
      name: string;
    }
  ];
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

export function getTopTv() {
  return fetch(
    `https://api.themoviedb.org/3/tv/top_rated?api_key=f346520ba452706de7caceee9bc65f64&language=ko&page=1`
  ).then((response) => response.json());
}
export function getPopTv() {
  return fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=f346520ba452706de7caceee9bc65f64&language=ko&page=2`
  ).then((response) => response.json());
}
export function getAirTv() {
  return fetch(
    `https://api.themoviedb.org/3/tv/airing_today?api_key=f346520ba452706de7caceee9bc65f64&language=ko&page=2`
  ).then((response) => response.json());
}

export function getSearch(keyword: string) {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=f346520ba452706de7caceee9bc65f64&language=ko&query=${keyword}&page=1&include_adult=false&region=kr`
  ).then((response) => response.json());
}

export function getSearchTv(keyword: string) {
  return fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=f346520ba452706de7caceee9bc65f64&language=ko&page=1&query=${keyword}`
  ).then((response) => response.json());
}

export function getGenres() {
  return fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=f346520ba452706de7caceee9bc65f64&language=ko`
  ).then((response) => response.json());
}
