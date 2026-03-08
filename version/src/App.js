import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Forgotpass from "./pages/Forgotpass";
import Register from "./pages/Register";
import Chat from "./pages/chat";
import Admin from "./components/Admin/admin";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import UpdateUser from "./pages/UpdateUser";
import NotFound from "./pages/Notfound";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <ChatContextProvider>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="/chat" element={user ? <Chat /> : <Login />} />
          {/* <Route path="/register" element={user ? <Chat /> : <Register />} /> */}
          <Route path="/forgotpass" element={<Forgotpass />} />
          {user && user.logintype === "Admin" && (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/updateuser/:id" element={<UpdateUser />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  );
}

export default App;
