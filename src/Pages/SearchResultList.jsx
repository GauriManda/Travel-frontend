import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import TourCard from "./../Shared/TourCard";


const SearchResultList = () => {
  const location = useLocation();
  const [data] = useState(location.state || []);

  return (
    <>
      <CommonSection title="Tour Search Result" />
      <section className="search-results">
        <div className="container">
          <div className="row">
            {data.length === 0 ? (
              <h4 className="text-center">No tour found</h4>
            ) : (
              data.map((tour) => (
                <div className="col-3" key={tour._id}>
                  <TourCard tour={tour} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchResultList;
