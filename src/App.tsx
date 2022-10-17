import {
  BrowserRouter as Router,
  Switch,
  Route,
  HashRouter,
} from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TV from "./Routes/Tv";

function App() {
  return (
    <HashRouter>
      <Header />
      <Switch>
        <Route path={["/tv", "/tv/videos/:videoID"]}>
          <TV />
        </Route>
        <Route path={["/search"]}>
          <Search />
        </Route>
        <Route path={["/", "/movies/:movieID"]}>
          <Home></Home>
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
