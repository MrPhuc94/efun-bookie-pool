import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Layout from "./screens/Home/Home";
import MAppPopups from "./common/MAppPopups";
import "./base.scss";

const PrivateRoute = [
  {
    path: "/",
    component: Layout,
  },
];

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {PrivateRoute.map((route, i) => (
            <Route key={i} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </Router>
      <MAppPopups />
    </Provider>
  );
};

export default App;
