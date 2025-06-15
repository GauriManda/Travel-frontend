import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from './frontend/src/context/AuthContext'; // Updated path
import Layout from "./frontend/src/Components/Layout";  

const MainLayout = () => {  
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthContextProvider>
  );
};

function App() {  
  return <MainLayout />;
}

export default App;