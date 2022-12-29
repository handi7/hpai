import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import WithNav from "./components/WithNav";
import UserDetails from "./pages/UserDetails";
import AddUser from "./pages/AddUser";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<WithNav />}>
          <Route element={<Home />} path="/" />
          <Route element={<UserDetails />} path="/details/:id" />
          <Route element={<AddUser />} path="/add-user" />
        </Route>
        <Route element={<Login />} path="/login" />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
