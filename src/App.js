import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MAppPopups from "./common/MAppPopups";
import "./base.scss";
import Home from "./screens/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import NotFound from "./screens/NotFound/NotFound";
import ToastMessage from "./components/UI/Toast/ToastMessage";

const PrivateRoute = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "*",
    component: NotFound,
  },
];

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {PrivateRoute.map((route, i) => (
            <Route
              exact
              key={i}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </Router>
      <MAppPopups />
      <ToastMessage />
    </Provider>
  );
};

export default App;
