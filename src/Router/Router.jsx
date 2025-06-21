import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../Pages/Home";
import About from "../Components/About";
import Gallery from "../Components/Gallery";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import FeaturedTourList from "../Featured/FeatureTourList";
import TourDetails from "../Pages/TourDetails";
import Tours from "../Featured/Tours"; 
import BookingSuccess from "../Pages/BookingSuccess";
import Experience from "../Components/Experience";



const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/featured" element={<FeaturedTourList />} />
      <Route path="/tours" element={<>  <Tours /> </>} />
      <Route path="/trek/:id" element={<TourDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/booking-success/:id" element={<BookingSuccess />} />
      <Route path="/experiences" element={<Experience />} />
      

    </Routes>
  );
};

export default Router;
