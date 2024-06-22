import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Album() {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [editPhotoId, setEditPhotoId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newThumbnailUrl, setNewThumbnailUrl] = useState('');
  const { albumId } = useParams();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/photos?albumId=${albumId}`);
        if (!response.ok) {
          throw new Error('Error fetching photos');
        }
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPhotos();
  }, [albumId]);

  const handleDelete = async (photoId) => {
    try {
      const response = await fetch(`http://localhost:3000/photos/${photoId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Error deleting photo');
      }
      setPhotos(photos.filter(photo => photo.id !== photoId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async (photoId) => {
    if (newTitle.trim() === '') {
      setError('Title cannot be empty');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/photos/${photoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) {
        throw new Error('Error updating photo');
      }

      const updatedPhoto = await response.json();
      setPhotos(photos.map(photo => (photo.id === photoId ? updatedPhoto : photo)));
      setEditPhotoId(null);
      setNewTitle('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (photoId, currentTitle) => {
    setEditPhotoId(photoId);
    setNewTitle(currentTitle);
  };

  const handleAddPhoto = async (event) => {
    event.preventDefault();

    if (newTitle.trim() === '' || newPhotoUrl.trim() === '' || newThumbnailUrl.trim() === '') {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/photos');
      if (!response.ok) {
        throw new Error('Error fetching photos');
      }
      const allPhotos = await response.json();
      const newPhotoId = allPhotos.length === 0 ? "1" : (parseInt(allPhotos[allPhotos.length - 1].id) + 1).toString();

      const newPhoto = {
        albumId: albumId,
        id: newPhotoId,
        title: newTitle,
        url: newPhotoUrl,
        thumbnailUrl: newThumbnailUrl
      };

      const addResponse = await fetch('http://localhost:3000/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPhoto)
      });

      if (!addResponse.ok) {
        throw new Error('Error adding new photo');
      }

      const createdPhoto = await addResponse.json();
      setPhotos([...photos, createdPhoto]);
      setNewTitle('');
      setNewPhotoUrl('');
      setNewThumbnailUrl('');
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Album {albumId}</h1>
      <ul>
        {photos.map(photo => (
          <li key={photo.id}>
            <img src={photo.thumbnailUrl} alt={photo.title} width="100" />
            {editPhotoId === photo.id ? (
              <>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button onClick={() => handleUpdate(photo.id)}>Save</button>
                <button onClick={() => setEditPhotoId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{photo.title}</p>
                <button onClick={() => handleDelete(photo.id)}>Delete</button>
                <button onClick={() => handleEdit(photo.id, photo.title)}>Update</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h2>Add New Photo</h2>
      <form onSubmit={handleAddPhoto}>
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={newPhotoUrl}
          onChange={(e) => setNewPhotoUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Thumbnail URL"
          value={newThumbnailUrl}
          onChange={(e) => setNewThumbnailUrl(e.target.value)}
        />
        <button type="submit">Add Photo</button>
      </form>
    </div>
  );
}

export default Album;