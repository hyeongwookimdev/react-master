import styled from "styled-components";
import { motion, useMotionValue, useTransform, useScroll } from "framer-motion";

const Wrapper = styled(motion.div)`
  width: 100vw;
  height: 200vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 40px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

function App() {
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-800, 800], [-360, 360]);
  const gredient = useTransform(
    x,
    [-800, 0, 800],
    [
      "linear-gradient(135deg, rgb(254, 202, 87), rgb(255, 159, 67))",
      "linear-gradient(135deg, rgb(29, 209, 161), rgb(33, 140, 116))",
      "linear-gradient(135deg, rgb(95, 39, 205), rgb(52, 31, 151))",
    ]
  );
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 5]);

  return (
    <Wrapper style={{ background: gredient }}>
      <Box style={{ x, rotateZ, scale }} drag="x" dragSnapToOrigin />
    </Wrapper>
  );
}

export default App;
