import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

/**
 * Home Component - Landing Page
 * 
 * CONVERTED FROM: index.html
 * OLD APPROACH: Static HTML with hardcoded content and navigation links
 * NEW APPROACH: React component using React Router Links for navigation
 * 
 * Changes:
 * - <a href="index.html"> → <Link to="/">
 * - HTML structure wrapped in JSX
 * - All inline CSS replaced with CSS classes
 * - Component is now reusable and can manage state if needed
 */
const Home = () => {
  return React.createElement(React.Fragment, null, [
    React.createElement('header', { className: "bg-success text-white py-4", key: "header" },
      React.createElement('div', { className: "container", key: "header-content" },
        React.createElement('h2', { className: "fw-bold m-0", key: "title" }, "Wildlife Conservation Conference")
      )
    ),
    React.createElement('div', { className: "container my-5", key: "main" },
      React.createElement('div', { className: "home-hero" }, [
        React.createElement('div', { className: "hero-callout mb-3", key: "callout" }, "Conference registration made easy"),
        React.createElement('h1', { className: "display-3", key: "h1" }, "Wildlife Conservation Conference"),
        React.createElement('p', { className: "lead", key: "intro" },
          "Meet with wildlife enthusiasts from all over the world to explore new strategies for protecting our animals and keeping them safe!"
        ),
        React.createElement('p', { className: "mb-4", key: "details" }, [
          "Date: July 1st, 2026 ",
          React.createElement('br', { key: "br1" }),
          "Location: Penn State ",
          React.createElement('br', { key: "br2" }),
          "Time: 5:00 PM EST"
        ]),
        React.createElement(Link, { to: "/signup", className: "btn btn-success btn-lg", key: "signup-link" }, "Register Now")
      ])
    ),
    React.createElement('footer', { className: "bg-dark text-white text-center py-3 mt-auto", key: "footer" },
      React.createElement('p', null, "© 2026 Wildlife Conservation Conference | IST 256 Group Project")
    )
  ]);
};

export default Home;
