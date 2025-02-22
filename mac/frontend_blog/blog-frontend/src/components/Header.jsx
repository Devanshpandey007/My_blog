import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Modal, Form } from 'react-bootstrap';
import { Link, Navigate, redirect, useNavigate } from 'react-router-dom';
import HandleSignup from '../utils/HandleSignup';
import HandleLogin from '../utils/HandleLogin';
import BlogPostView from './fetchPost';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleLoginModal = () => setShowLoginModal(!showLoginModal);
  const toggleSignupModal = () => setShowSignupModal(!showSignupModal);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userId = sessionStorage.getItem('user_id');
    const userRole = sessionStorage.getItem('user_role');

    console.log("User ID:", userId, "User Role:", userRole);

    if (accessToken && refreshToken) {
      setLoggedIn(true);

      if (userRole === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = async () => {
    const accessToken = sessionStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      alert("No refresh token found. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8008/blog/logout/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const data = await response.json();
      if (response.ok) {
        sessionStorage.clear();
        localStorage.clear();
        setLoggedIn(false);
        setIsAdmin(false);
        alert('Logged out successfully!');
        navigate("/");
      } else {
        alert(data.message || "Error logging out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Error logging out");
    }
  };

  const handleLoginSuccess = () => {
    setLoggedIn(true);

    const userRole = sessionStorage.getItem('user_role');
    if (userRole === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">My Blogs</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Blogs</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              {/* <Nav.Link href="#" disabled>Contact</Nav.Link> */}
              {loggedIn && (
                // Using Link with dynamic user ID for dashboard
                <Nav.Link as={Link} to={`/user/${sessionStorage.getItem('user_id')}`}>
                  Dashboard
                </Nav.Link>
              )}
            </Nav>
            <Nav className="ms-auto">
              {!loggedIn ? (
                <>
                  <Nav.Link onClick={toggleLoginModal}>Login</Nav.Link>
                  <Nav.Link onClick={toggleSignupModal}>Sign Up</Nav.Link>
                </>
              ) : (
                <Nav.Link variant="danger" onClick={handleLogout}>
                  Logout
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={toggleLoginModal}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => HandleLogin(e, setIsAdmin, email, password, setError, handleLoginSuccess)}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <br />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={toggleSignupModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => HandleSignup(e, email, password, username, setError, handleLoginSuccess)}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <br />
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Header;
