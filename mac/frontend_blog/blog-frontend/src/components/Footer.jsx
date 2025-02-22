import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../App.css';

const Footer = () => {
  return (
    <footer className="py-4">
      <Container>
        <Row>
          <Col className="text-center">
            <p>© 2024 My Blog | All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
