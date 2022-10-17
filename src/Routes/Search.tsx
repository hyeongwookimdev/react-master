import { useQuery } from "@tanstack/react-query";
import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { getSearch, IGetMoviesResult, IMovie } from "../api";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";
import { useState } from "react";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  text-shadow: 5px 5px 7.5px black;
`;
const Title = styled.h2`
  font-size: 68px;
  font-weight: 600;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;
const Slider = styled.div`
  top: 100px;
  position: relative;
  height: 500px;
  margin-left: 60px;
  margin-bottom: 100px;
`;
const SliderTitle = styled.h3`
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 10px;
`;
const SliderBtn = styled(motion.button)`
  position: absolute;
  right: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  border: none;
  color: ${(props) => props.theme.white.lighter};
  width: 50px;
  text-align: center;
  font-weight: 600;
  font-size: 20px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  position: absolute;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 500px;
  font-size: 66px;
  cursor: pointer;
  border-radius: 7px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 50%;
  display: flex;
  flex-direction: column;
  border-radius: 7px;
  justify-content: flex-end;
  h4 {
    font-size: 25px;
  }
  h5 {
    font-size: 18px;
    margin-bottom: 5px;
  }
  h6 {
    font-size: 18px;
    margin-bottom: 5px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  color: ${(props) => props.theme.white.lighter};
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 48px;
  font-weight: 600;
  position: relative;
  top: -130px;
  h2 {
    font-size: 32px;
  }
`;
const BigOverview = styled.p``;
const BigInfoContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  padding: 20px;
  position: relative;
  top: -130px;
`;
const BigInfoLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  justify-content: flex-start;
  span {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;
const BigInfoRight = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  padding-left: 15px;
  span {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 600;
  }
`;
const rowVariants = {
  hidden: { x: window.outerWidth },
  visible: { x: 0 },
  exit: { x: -window.outerWidth },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    y: -50,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      type: "tween",
      delay: 0.5,
      duration: 0.3,
    },
  },
};
const btnVariants = {
  start: {
    opacity: 0.5,
  },
  hover: {
    opacity: 1,
  },
};
const offset = 6;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data, isLoading } = useQuery<IGetMoviesResult>(["keyword"], () =>
    getSearch(keyword ? keyword : "")
  );

  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/search/:movieId");
  const { scrollY } = useScroll();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/search/${movieId}`);
  };

  const onOverlayClick = () => history.push(`/search?keyword=${keyword}`);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie: IMovie) => movie.id === +bigMovieMatch.params.movieId
    );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider>
            <SliderTitle>검색 결과</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.7 }}
                key={index}
              >
                {data?.results
                  .slice(offset * index, offset * index + offset)
                  .map((movie: IMovie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.poster_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                        <h5>{movie.original_title}</h5>
                        <h6>{movie.release_date.split("-")[0]}</h6>
                        <h6>⭐️ {movie.vote_average}</h6>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderBtn
              onClick={increaseIndex}
              variants={btnVariants}
              whileHover={"hover"}
              initial={"start"}
            >
              {"➡️"}
            </SliderBtn>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, #2f2f2f, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>
                        <h1>{clickedMovie.title}</h1>
                        <h2>{clickedMovie.original_title}</h2>
                      </BigTitle>
                      <BigInfoContainer>
                        <BigInfoLeft>
                          <span>
                            {clickedMovie.release_date.split("-")[0]}년 개봉
                          </span>
                          <BigOverview>{clickedMovie.overview}</BigOverview>
                        </BigInfoLeft>
                        <BigInfoRight>
                          <span>
                            평점⭐️: {clickedMovie.vote_average} (
                            {clickedMovie.vote_count})
                          </span>
                          <span>인기도: {clickedMovie.popularity}</span>
                        </BigInfoRight>
                      </BigInfoContainer>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
