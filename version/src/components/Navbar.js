import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./Chats/Notification";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isAdminRoute = location.pathname === "/admin";

  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
      <Container className="pt-4">
        <h2>
          <Link to="/chat" className="link-light text-decoration-none pb-4">
            InstantChatApp
          </Link>
        </h2>
        <Nav>
          <Stack direction="horizontal" gap={4}>
            {user ? (
              <>
                <span className="text-warning pb-4">
                  Logged in as {user.name}
                </span>
                {user.logintype === "Admin" && (
                  <>
                    {isAdminRoute && (
                      <Link
                        to="/register"
                        className="link-light text-decoration-none pb-4"
                      >
                        Register
                      </Link>
                    )}
                    <Link
                      to="/admin"
                      className="link-light text-decoration-none pb-4"
                    >
                      Admin
                    </Link>
                  </>
                )}
                <Notification />
                <Link
                  to="/"
                  className="link-light text-decoration-none pb-4"
                  onClick={() => logout()}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="link-light text-decoration-none pb-4">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="link-light text-decoration-none pb-4"
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
