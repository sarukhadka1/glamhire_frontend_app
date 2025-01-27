import React, { useEffect, useState } from "react";
import { getUserWishlistApi, removeFromWishlistApi } from "../../apis/Api";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import "./Favourites.css";
 
const Favourites = () => {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetchWishlist();
  }, []);
 
  const fetchWishlist = async () => {
    try {
        const res = await getUserWishlistApi();
        if (Array.isArray(res.data.data)) {
            setWishlist(res.data.data);
        } else {
            throw new Error('Wishlist data is not an array');
        }
    } catch (err) {
        setError(err.response?.data?.message || 'Error fetching wishlist');
    }
};
 
  const handleRemove = async (artistId) => {
    const confirmDialog = window.confirm("Are you sure you want to remove this property from your wishlist?");
    if (!confirmDialog) return;
 
    try {
      await removeFromWishlistApi(artistId);
      toast.success('Artist removed from wishlist');
      fetchWishlist();
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing artist from wishlist');
      toast.error('Error removing artist from wishlist');
    }
  };
 
  return (
    <>
    <div className="container mt-5">
      <h2>My Wishlist</h2>
      {error && <p className="text-danger">{error}</p>}
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-container">
          {wishlist.map((artist) => (
            <div key={artist._id} className="wishlist-item">
              <img
                src={`https://localhost:5000/artists/${artist.artistImage}`}
                alt={artist.artistName}
                className="wishlist-image"
              />
              <div className="wishlist-details">
                <h4 className="wishlist-artist-name">{artist.artistName}</h4>
                <p className="wishlist-artist-genre">{artist.artistGenre}</p>
                <p className="wishlist-artist-rate">Rs {artist.artistRate}</p>
              </div>
              <button className="wishlist-remove" onClick={() => handleRemove(artist._id)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
  );
};
 
export default Favourites;