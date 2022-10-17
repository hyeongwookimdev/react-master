import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getAirTv,
  getGenres,
  getPopMovies,
  getPopTv,
  getTopMovies,
  getTopTv,
  getUpMovies,
  IGetGenres,
  IMovie,
  ITv,
} from "../api";
import { makeImagePath } from "../utils";

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
  top: -150px;
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
  position: relative;
  cursor: pointer;
  border-radius: 7px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const RatingNum = styled(motion.div)`
  font-size: 100px;
  bottom: -102px;
  left: -70px;
  font-size: 275px;
  position: absolute;
  color: ${(props) => props.theme.black.veryDark};
  text-shadow: -3px 0px #e5e5e5, 0px 3px #e5e5e5, 3px 0px #e5e5e5,
    0px -3px #e5e5e5;
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
    zIndex: 99,
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

function TV() {
  const history = useHistory();
  const bigVideoMatch = useRouteMatch<{ videoId: string }>(
    "/tv/videos/:videoId"
  );
  const { scrollY } = useScroll();

  const useMultipleQuery = () => {
    const topRatedTv = useQuery(["topRatedTv"], getTopTv);
    const popularTv = useQuery(["popularTv"], getPopTv);
    const upCommingTv = useQuery(["airingTv"], getAirTv);
    return [topRatedTv, popularTv, upCommingTv];
  };

  const [
    { isLoading: loadingTopRatedTv, data: topRatedTvData },
    { isLoading: loadingPopularTv, data: popularTvData },
    { isLoading: loadingUpCommingTv, data: upCommingTvData },
  ] = useMultipleQuery();

  const [indexTopTv, setIndexTopTv] = useState(0);
  const [leavingTopTv, setLeavingTopTv] = useState(false);
  const toggleLeavingTopTv = () => setLeavingTopTv((prev) => !prev);
  const increaseIndexTopTv = () => {
    if (topRatedTvData) {
      if (leavingTopTv) return;
      toggleLeavingTopTv();
      const totalMovies = topRatedTvData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 2;
      setIndexTopTv((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const [indexPopTv, setIndexPopTv] = useState(0);
  const [leavingPopTv, setLeavingPopTv] = useState(false);
  const toggleLeavingPopTv = () => setLeavingPopTv((prev) => !prev);
  const increaseIndexPopTv = () => {
    if (popularTvData) {
      if (leavingPopTv) return;
      toggleLeavingPopTv();
      const totalMovies = popularTvData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexPopTv((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const [indexUpTv, setIndexUpTv] = useState(0);
  const [leavingUpTv, setLeavingUpTv] = useState(false);
  const toggleLeavingUpTv = () => setLeavingUpTv((prev) => !prev);
  const increaseIndexUpTv = () => {
    if (upCommingTvData) {
      if (leavingUpTv) return;
      toggleLeavingUpTv();
      const totalMovies = upCommingTvData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndexUpTv((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const onBoxClicked = (videoId: number) => {
    history.push(`/tv/videos/${videoId}`);
  };
  const onOverlayClick = () => history.push("/tv");

  const clickedTopVideo =
    bigVideoMatch?.params.videoId &&
    topRatedTvData?.results.find(
      (video: ITv) => video.id === +bigVideoMatch.params.videoId
    );

  const clickedPopVideo =
    bigVideoMatch?.params.videoId &&
    popularTvData?.results.find(
      (video: ITv) => video.id === +bigVideoMatch.params.videoId
    );
  const clickedUpVideo =
    bigVideoMatch?.params.videoId &&
    upCommingTvData?.results.find(
      (video: ITv) => video.id === +bigVideoMatch.params.videoId
    );

  return (
    <Wrapper>
      {loadingTopRatedTv && loadingPopularTv && loadingUpCommingTv ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              topRatedTvData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{topRatedTvData?.results[0].name}</Title>
            <Overview>{topRatedTvData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitle>오늘 대한민국의 TOP 10 시리즈</SliderTitle>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeavingTopTv}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.7 }}
                key={indexTopTv}
              >
                {topRatedTvData?.results
                  .slice(0, 10)
                  .slice(offset * indexTopTv, offset * indexTopTv + offset)
                  .map((video: ITv, indexNum: number) => (
                    <Box
                      layoutId={video.id + ""}
                      key={video.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(video.id)}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(video.poster_path, "w500")}
                      style={{ marginLeft: "60px" }}
                    >
                      <Info
                        variants={infoVariants}
                        style={{
                          top: 0,
                          background:
                            "linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0))",
                          justifyContent: "flex-start",
                        }}
                      >
                        <h4>{video.name}</h4>
                        <h5>{video.original_name}</h5>
                        <h6>{video.first_air_date.split("-")[0]}</h6>
                        <h6>⭐️ {video.vote_average}</h6>
                      </Info>
                      {indexTopTv === 0 ? (
                        <RatingNum>{indexNum + 1}</RatingNum>
                      ) : (
                        <RatingNum>{indexNum + 7}</RatingNum>
                      )}
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderBtn
              onClick={increaseIndexTopTv}
              variants={btnVariants}
              whileHover={"hover"}
              initial={"start"}
            >
              {"➡️"}
            </SliderBtn>
          </Slider>
          <Slider>
            <SliderTitle>넷플릭스 인기 시리즈</SliderTitle>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeavingPopTv}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.7 }}
                key={indexPopTv}
              >
                {popularTvData?.results

                  .slice(offset * indexPopTv, offset * indexPopTv + offset)
                  .map((video: ITv) => (
                    <Box
                      layoutId={video.id + ""}
                      key={video.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(video.id)}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(video.poster_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{video.name}</h4>
                        <h5>{video.original_name}</h5>
                        <h6>{video.first_air_date.split("-")[0]}</h6>
                        <h6>⭐️ {video.vote_average}</h6>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderBtn
              onClick={increaseIndexPopTv}
              variants={btnVariants}
              whileHover={"hover"}
              initial={"start"}
            >
              {"➡️"}
            </SliderBtn>
          </Slider>
          <Slider>
            <SliderTitle>방영 중인 시리즈</SliderTitle>
            <AnimatePresence initial={false} onExitComplete={toggleLeavingUpTv}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 0.7 }}
                key={indexUpTv}
              >
                {upCommingTvData?.results

                  .slice(offset * indexUpTv, offset * indexUpTv + offset)
                  .map((video: ITv) => (
                    <Box
                      layoutId={video.id + ""}
                      key={video.id}
                      variants={boxVariants}
                      onClick={() => onBoxClicked(video.id)}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(video.poster_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{video.name}</h4>
                        <h5>{video.original_name}</h5>
                        <h6>{video.first_air_date.split("-")[0]}</h6>
                        <h6>⭐️ {video.vote_average}</h6>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderBtn
              onClick={increaseIndexUpTv}
              variants={btnVariants}
              whileHover={"hover"}
              initial={"start"}
            >
              {"➡️"}
            </SliderBtn>
          </Slider>

          <AnimatePresence>
            {bigVideoMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigVideoMatch.params.videoId}
                >
                  {clickedTopVideo && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, #2f2f2f, transparent), url(${makeImagePath(
                            clickedTopVideo.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>
                        <h1>{clickedTopVideo.name}</h1>
                        <h2>{clickedTopVideo.original_name}</h2>
                      </BigTitle>
                      <BigInfoContainer>
                        <BigInfoLeft>
                          <span>
                            {clickedTopVideo.first_air_date.split("-")[0]}년
                            방영
                          </span>
                          <BigOverview>{clickedTopVideo.overview}</BigOverview>
                        </BigInfoLeft>
                        <BigInfoRight>
                          <span>
                            평점⭐️: {clickedTopVideo.vote_average} (
                            {clickedTopVideo.vote_count})
                          </span>
                          <span>인기도: {clickedTopVideo.popularity}</span>
                        </BigInfoRight>
                      </BigInfoContainer>
                    </>
                  )}
                  {clickedPopVideo && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, #2f2f2f, transparent), url(${makeImagePath(
                            clickedPopVideo.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>
                        <h1>{clickedPopVideo.name}</h1>
                        <h2>{clickedPopVideo.original_name}</h2>
                      </BigTitle>
                      <BigInfoContainer>
                        <BigInfoLeft>
                          <span>
                            {clickedPopVideo.first_air_date.split("-")[0]}년
                            방영
                          </span>
                          <BigOverview>{clickedPopVideo.overview}</BigOverview>
                        </BigInfoLeft>
                        <BigInfoRight>
                          <span>
                            평점⭐️: {clickedPopVideo.vote_average} (
                            {clickedPopVideo.vote_count})
                          </span>
                          <span>인기도: {clickedPopVideo.popularity}</span>
                        </BigInfoRight>
                      </BigInfoContainer>
                    </>
                  )}
                  {clickedUpVideo && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, #2f2f2f, transparent), url(${makeImagePath(
                            clickedUpVideo.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>
                        <h1>{clickedUpVideo.name}</h1>
                        <h2>{clickedUpVideo.original_name}</h2>
                      </BigTitle>
                      <BigInfoContainer>
                        <BigInfoLeft>
                          <span>
                            {clickedUpVideo.first_air_date.split("-")[0]}년 방영
                          </span>
                          <BigOverview>{clickedUpVideo.overview}</BigOverview>
                        </BigInfoLeft>
                        <BigInfoRight>
                          <span>
                            평점⭐️: {clickedUpVideo.vote_average} (
                            {clickedUpVideo.vote_count})
                          </span>
                          <span>인기도: {clickedUpVideo.popularity}</span>
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

export default TV;
