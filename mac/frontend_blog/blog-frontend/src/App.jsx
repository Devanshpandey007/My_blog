// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import React from "react"
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import LandingPage from "./components/LandingPage";
// import BlogPostForm from "./components/writeBlog"; 
// import HandleLogin from './utils/HandleLogin';
// import HandleSignup from './utils/HandleSignup';
// import BlogPostView from './components/fetchPost';
// import HorizontalCard from './components/About';
// import DashBoard from './components/dashboard';
// function App() {
  
//   return (
//     <>
//       <div className="header">
//         <Header />
//       </div>
//       <div className="content-body">
//         <Router>
//           <Routes>
//             <Route path="/" element={<LandingPage />} /> 
//             <Route path="/create" element={<BlogPostForm/>} />
//             <Route path="/login" element={<HandleLogin />} /> 
//             <Route path="/signup" element={<HandleSignup />} />
//             <Route path="/posts/:id" element={<BlogPostView/>}/>
//             <Route path="/about" element={<HorizontalCard/>}/>
//             <Route path="/user/:id" element={<DashBoard/>}/>
//           </Routes>
//         </Router>
//       </div>
//       <div className="footer">
//         <Footer />
//       </div>
//     </>
//   );
// }

// export default App;


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import BlogPostForm from "./components/writeBlog"; 
import HandleLogin from './utils/HandleLogin';
import HandleSignup from './utils/HandleSignup';
import BlogPostView from './components/fetchPost';
import HorizontalCard from './components/About';
import DashBoard from './components/dashboard';

function App() {
  return (
    // Wrap the entire app in Router to enable routing
    <Router>
      <div className="header">
        <Header />
      </div>
      <div className="content-body">
        <Routes>
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/create" element={<BlogPostForm/>} />
          <Route path="/login" element={<HandleLogin />} /> 
          <Route path="/signup" element={<HandleSignup />} />
          <Route path="/posts/:id" element={<BlogPostView/>}/>
          <Route path="/about" element={<HorizontalCard/>}/>
          <Route path="/user/:id" element={<DashBoard/>}/>
        </Routes>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </Router>
  );
}

export default App;
