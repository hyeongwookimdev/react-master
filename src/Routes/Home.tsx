import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../api";

function Home() {
  const { data, isLoading } = useQuery(["movies", "nowPlaying"], getMovies);
  console.log(data, isLoading);

  return (
    <div
      style={{
        height: "200vh",
      }}
    >
      Hello Home!
    </div>
  );
}

export default Home;
