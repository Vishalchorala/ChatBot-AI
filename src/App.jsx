import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import { paths } from "./constant/paths";
import AuthLayout from "./Layout/AuthLayout";
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";
import Error from "./Components/Error";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ChatBot from "./pages/ChatBot";
import ForgotPassword from "./Components/auth/ForgotPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path={paths.home} element={<Home />} />

          <Route element={<AuthLayout />}>
            <Route path={paths.logIn} element={<Login />} />
            <Route path={paths.signUp} element={<Signup />} />
            <Route path={paths.forgotPassword} element={<ForgotPassword />} />
          </Route>

          <Route element={<MainLayout />} >
            <Route path={paths.chatBot} element={<ChatBot />} />
            <Route path={paths.profile} element={<Profile />} />
          </Route>

          <Route path={paths.error} element={<Error />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
