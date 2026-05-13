import LandingPage from "./LandingPage";
import MobileLandingPage from "./MobileLandingPage";
import { useWindowWidth } from "./hooks/useWindowWidth";

function LandingRouter() {
  const width = useWindowWidth();
  return width < 768 ? <MobileLandingPage /> : <LandingPage />;
}

export default LandingRouter;
