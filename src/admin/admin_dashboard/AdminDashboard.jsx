import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createArtistApi, deleteArtist, getAllArtists } from "../../apis/Api";
import Navbar from "../../components/Navbar";
import AdminNavbar from '../../components/AdminNavbar';

const AdminDashboard = () => {
    const [artists, setArtists] = useState([]);
    const [selectedArtist, setSelectedArtist] = useState(null);

    useEffect(() => {
        getAllArtists().then((res) => {
            setArtists(res.data.artists);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const [artistName, setArtistName] = useState('');
    const [artistGenre, setArtistGenre] = useState('');
    const [artistRate, setArtistRate] = useState('');
    const [artistDescription, setArtistDescription] = useState('');
    const [artistImage, setArtistImage] = useState('');
    const [previewImage, setPreviewImage] = useState('');

    const handleImage = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file); // Debug line
            setArtistImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('artistName', artistName);
        formData.append('artistGenre', artistGenre);
        formData.append('artistRate', artistRate);
        formData.append('artistDescription', artistDescription);
        if (artistImage) formData.append('artistImage', artistImage);
    
        // Log FormData contents
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        createArtistApi(formData).then((res) => {
            if (res.status === 201) {
                toast.success(res.data.message);
                // Reset form and close modal
                setArtistName('');
                setArtistGenre('');
                setArtistRate('');
                setArtistDescription('');
                setArtistImage(null);
                setPreviewImage('');
                document.getElementById('postArtistModal').click(); // Close the modal programmatically
            }
        }).catch((error) => {
            if (error.response) {
                toast.error("Error: " + error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this artist?")) {
            deleteArtist(id).then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message);
                    window.location.reload();
                }
            }).catch((error) => {
                toast.error("Server Error: " + error.response.data.message);
            });
        }
    };

    const handleDescriptionClick = (artist) => {
        setSelectedArtist(artist);
    };

    const handleCloseModal = () => {
        setSelectedArtist(null);
    };

    return (
        <div className="dashboard-container">
            <style>
                {`
                    .dashboard-container {
                        background-color: #f8f4f9;
                        padding: 20px;
                    }

                    .dashboard-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    }

                    .dashboard-title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #6a0dad;
                    }

                    .dashboard-stats {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px;
                        margin-bottom: 20px;
                    }

                    .stat-box {
                        background-color: white;
                        border: 1px solid #e0e0e0;
                        border-radius: 10px;
                        padding: 20px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }

                    .stat-title {
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }

                    .stat-value {
                        font-size: 24px;
                        color: #6a0dad;
                    }

                    .table-container {
                        background-color: white;
                        border: 1px solid #e0e0e0;
                        border-radius: 10px;
                        padding: 20px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }

                    .description-container {
                        max-height: 60px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        cursor: pointer;
                    }

                    .description-container .view-more {
                        color: blue;
                        cursor: pointer;
                        font-weight: bold;
                    }

                    .description-container:hover .view-more {
                        text-decoration: underline;
                    }

                    .modal.show {
                        display: block;
                    }

                    .modal-backdrop {
                        z-index: -1;
                    }

                    .form-container {
                        display: grid;
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }

                    .form-control {
                        width: 100%;
                    }
                `}
            </style>

            <div className="dashboard-header">
                <h5 className="dashboard-title">Admin Dashboard</h5>
                <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#postArtistModal" style={{ backgroundColor: 'purple', borderColor: 'purple' }}>Add Artist</button>
            </div>

            <div className="dashboard-stats">
                <div className="stat-box">
                    <div className="stat-title">Total Revenue</div>
                    <div className="stat-value">Rs.12099</div>
                </div>
                <div className="stat-box">
                    <div className="stat-title">Affiliate Revenue</div>
                    <div className="stat-value">Rs.12099</div>
                </div>
                <div className="stat-box">
                    <div className="stat-title">Refunds</div>
                    <div className="stat-value">0.00</div>
                </div>
                <div className="stat-box">
                    <div className="stat-title">Avg. Revenue Per User</div>
                    <div className="stat-value">Rs.28000</div>
                </div>
            </div>

            <div className="table-container">
                <h5>Artists at <span style={{ color: '#6a0dad' }}>Glam Hire</span></h5>
                <table className='table mt-2'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Artist Image</th>
                            <th>Artist Name</th>
                            <th>Artist Genre</th>
                            <th>Artist Rate</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            artists.map((singleArtist) => (
                                <tr key={singleArtist._id}>
                                    <td><img width={"40px"} height={"40px"} src={`https://localhost:5000/artists/${singleArtist.artistImage}`} alt="" /></td>
                                    <td>{singleArtist.artistName}</td>
                                    <td>{singleArtist.artistGenre}</td>
                                    <td>{singleArtist.artistRate}</td>
                                    <td>
                                        <div className="description-container" onClick={() => handleDescriptionClick(singleArtist)}>
                                            {singleArtist.artistDescription.slice(0, 100)}...
                                            {/* <span className="view-more"> View More</span> */}
                                        </div>
                                    </td>
                                    <td>
                                        <Link to={`/admin/update/${singleArtist._id}`} className='btn btn-primary' style={{ backgroundColor: 'purple', borderColor: 'purple' }}>Edit</Link>
                                        <button onClick={() => handleDelete(singleArtist._id)} className='btn btn-danger ms-2' style={{ backgroundColor: 'red', borderColor: '#f8b400' }}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {selectedArtist && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedArtist.artistName}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>{selectedArtist.artistDescription}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="modal fade" id="postArtistModal" tabIndex="-1" aria-labelledby="postArtistModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="postArtistModalLabel">Add Artist</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="form-container">
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="artistName"
                                        placeholder="Enter Artist Name"
                                        value={artistName}
                                        onChange={(e) => setArtistName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="artistGenre"
                                        placeholder="Enter Artist Genre"
                                        value={artistGenre}
                                        onChange={(e) => setArtistGenre(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="artistRate"
                                        placeholder="Enter Artist Rate"
                                        value={artistRate}
                                        onChange={(e) => setArtistRate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        className="form-control"
                                        id="artistDescription"
                                        rows="3"
                                        placeholder="Enter Artist Description"
                                        value={artistDescription}
                                        onChange={(e) => setArtistDescription(e.target.value)}
                                    ></textarea>
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="artistImage"
                                        onChange={handleImage}
                                    />
                                    {previewImage && <img src={previewImage} alt="Preview" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }} />}
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-secondary" style={{ backgroundColor: 'purple', borderColor: 'purple', marginTop: '20px', width: '100%' }}>Add Artist</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
