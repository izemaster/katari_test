import * as React from "react";
import ReactDOM from 'react-dom';
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter as Router , Routes, Route, Link } from "react-router-dom";

import NewsEdit from "./Edit";
import NewsList from "./List";
import NewsCreate from "./Create";

function App() {
  return (<Router>


    <Container className="mt-5">
      <Row>
        <Col md={12}>
          <Routes>
            <Route path="/noticias/create" element={<NewsCreate />} />
            <Route path="/noticias/edit/:id" element={<NewsEdit />} />
            <Route exact path='/' element={<NewsList />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  </Router>);
}

export default App;
if (document.getElementById('app-container')) {
    ReactDOM.render(<App />, document.getElementById('app-container'));
}
