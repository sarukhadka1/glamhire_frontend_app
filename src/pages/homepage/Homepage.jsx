import React, { useEffect, useState } from "react";
import { getAllArtists, artistPagination, getArtistCount } from "../../apis/Api";
import "./Homepage.css";

import ArtistCard from "../../components/ArtistCard";

const Homepage = () => {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('name');
  const limit = 8;

  useEffect(() => {
    fetchArtistCount();
    fetchArtists(page, searchQuery, sortOrder, sortBy);
  }, [page, searchQuery, sortOrder, sortBy]);

  const fetchArtistCount = async () => {
    try {
      const res = await getArtistCount();
      const count = res.data.artistCount;
      setTotalPages(Math.ceil(count / limit));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchArtists = async (pageNum, searchQuery, sortOrder, sortBy) => {
    try {
      const res = await artistPagination(pageNum, limit, searchQuery, sortOrder, sortBy);
      setArtists(res.data.artists);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchArtists(1, searchQuery, sortOrder, sortBy);
  };

  const handlePagination = (pageNum) => {
    setPage(pageNum);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
    fetchArtists(1, searchQuery, e.target.value, sortBy);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
    fetchArtists(1, searchQuery, sortOrder, e.target.value);
  };

  return (
    <>
      
      <div className="container">
        <div id="carouselExampleCaptions" className="carousel slide">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="https://images.pexels.com/photos/2813995/pexels-photo-2813995.jpeg" className="d-block w-100" alt="..." />
              <div className="carousel-caption d-none d-md-block">
                <h5>Makeup artist</h5>
                <p>Make up is the pride of every woman.</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="https://images.pexels.com/photos/2113855/pexels-photo-2113855.jpeg" className="d-block w-100" alt="..." />
              <div className="carousel-caption d-none d-md-block">
                <h5>Beauty</h5>
                <p>beauty lies within yourself</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="https://cdn.britannica.com/35/222035-131-9FC95B31/makeup-cosmetics.jpg" className="d-block w-100" alt="..." />
              <div className="carousel-caption d-none d-md-block">
                <h5></h5>
                <p>makeup and MUA of everything Available</p>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <h2 className="mt-2">Available Artists</h2>

        <form onSubmit={handleSearch} className="d-flex mb-4">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-primary" style={{ backgroundColor: 'purple', color: 'white', border: 'none' }}>Search</button>
 
        </form>

        <div className="mb-4">
          <label htmlFor="sortOrder" className="me-2">Sort by:</label>
          <select
            id="sortOrder"
            className="form-select me-2"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

         
        </div>

        <div className="row row-cols-1 row-cols-md-4 g-4">
          {artists.map((singleArtist) => (
            <div className="col" key={singleArtist._id}>
              <ArtistCard artistInformation={singleArtist} color={'red'} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePagination(1)} disabled={page === 1}>
                First
              </button>
            </li>
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePagination(page - 1)} disabled={page === 1}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => handlePagination(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePagination(page + 1)} disabled={page === totalPages}>
                Next
              </button>
            </li>
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => handlePagination(totalPages)} disabled={page === totalPages}>
                Last
              </button>
            </li>
          </ul>
        </nav>
        
      </div>
        
    </>
    
  );
};

export default Homepage;
