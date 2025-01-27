import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleArtist, updateArtist } from '../../apis/Api';
import { toast } from 'react-toastify';

const UpdateArtist = () => {
    const { id } = useParams();

    useEffect(() => {
        getSingleArtist(id).then((res) => {
            setArtistName(res.data.artist.artistName);
            setArtistGenre(res.data.artist.artistGenre);
            setArtistRate(res.data.artist.artistRate);
            setArtistDescription(res.data.artist.artistDescription);
            setOldImage(res.data.artist.artistImage);
        }).catch((error) => {
            console.log(error);
        });
    }, [id]);

    const [artistName, setArtistName] = useState('');
    const [artistGenre, setArtistGenre] = useState('');
    const [artistRate, setArtistRate] = useState('');
    const [artistDescription, setArtistDescription] = useState('');
    const [artistNewImage, setArtistNewImage] = useState(null);
    const [previewNewImage, setPreviewNewImage] = useState(null);
    const [oldImage, setOldImage] = useState('');

    const handleImage = (event) => {
        const file = event.target.files[0];
        setArtistNewImage(file);
        setPreviewNewImage(URL.createObjectURL(file));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('artistName', artistName);
        formData.append('artistGenre', artistGenre);
        formData.append('artistRate', artistRate);
        formData.append('artistDescription', artistDescription);
        if (artistNewImage) {
            formData.append('artistImage', artistNewImage);
        }

        updateArtist(id, formData).then((res) => {
            if (res.status === 201) {
                toast.success(res.data.message);
            }
        }).catch((error) => {
            if (error.response.status === 500) {
                toast.error(error.response.data.message);
            } else if (error.response.status === 400) {
                toast.error(error.response.data.message);
            }
        });
    };

    return (
        <div className="container mt-3" style={styles.container}>
            <h2 style={styles.title}>Update Artist Details for <span style={styles.artistName}>{artistName}</span></h2>
            <div className='d-flex flex-column align-items-center'>
                <form style={styles.form}>
                    <label style={styles.label}>Artist Name</label>
                    <input value={artistName} onChange={(e) => setArtistName(e.target.value)} className='form-control' type="text" placeholder='Enter artist name' style={styles.input} />

                    <label style={styles.label}>Artist Genre</label>
                    <select value={artistGenre} onChange={(e) => setArtistGenre(e.target.value)} className='form-control' style={styles.input}>
                        <option value="party">Party</option>
                        <option value="engagement">Engagement</option>
                        <option value="bridal">Bridal</option>
                        <option value="mehendi">Mehendi</option>
                        <option value="reception">Reception</option>
                    </select>

                    <label style={styles.label}>Artist Rate</label>
                    <input value={artistRate} onChange={(e) => setArtistRate(e.target.value)} className='form-control' type="number" placeholder='Enter artist rate' style={styles.input} />

                    <label style={styles.label}>Artist Description</label>
                    <textarea value={artistDescription} onChange={(e) => setArtistDescription(e.target.value)} className='form-control' style={styles.textarea}></textarea>

                    <label style={styles.label}>Choose Artist Image</label>
                    <input onChange={handleImage} type="file" className='form-control' style={styles.input} />

                    <button onClick={handleUpdate} className='btn' style={styles.button}>Update Artist</button>
                </form>

                <div className='mt-4'>
                    <h6 style={styles.label}>Previewing Old Image</h6>
                    <img height={'150px'} width={'300px'} className='image-fluid-rounded-4 object-fit-cover' src={`https://localhost:5000/artists/${oldImage}`} alt="Old Artist" style={styles.image}/>

                    {previewNewImage && <>
                        <h6 className='mt-3' style={styles.label}>New Image</h6>
                        <img height={'150px'} width={'300px'} className='image-fluid-rounded-4 object-fit-cover' src={previewNewImage} alt="New Artist" style={styles.image}/>
                    </>}
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '600px',
        backgroundColor: '#f8f4f9',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        color: '#6a0dad',
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px',
    },
    artistName: {
        color: '#ff69b4',
    },
    form: {
        width: '100%',
    },
    label: {
        color: '#6a0dad',
        fontWeight: 'bold',
        marginBottom: '10px',
        display: 'block',
    },
    input: {
        marginBottom: '15px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    textarea: {
        marginBottom: '15px',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    button: {
        backgroundColor: '#ff69b4',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        border: 'none',
        width: '100%',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    image: {
        borderRadius: '5px',
        objectFit: 'cover',
    }
};

export default UpdateArtist;
