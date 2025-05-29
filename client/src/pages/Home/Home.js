import "./Home.css";
import ResponsiveAppBar from "../../components/NavBar/NavBar";
import LandingPage from "../../components/LandingPage/LandingPage";

function Home() {
  return (
    <div>
      <ResponsiveAppBar />
      <LandingPage />
    </div>
  );
}

export default Home;
