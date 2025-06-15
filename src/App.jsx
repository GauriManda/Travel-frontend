import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext"
import Layout from "./Components/Layout";  

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