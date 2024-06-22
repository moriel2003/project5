import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function Albums() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
      setError("User not found in local storage");
      return;
    }

    const fetchAlbums = async () => {
      try {
        const response = await fetch(`http://localhost:3000/albums?userId=${id}`);
        if (!response.ok) {
          throw new Error('Error fetching albums');
        }
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAlbums();
  }, [id]);

  const handleAddAlbum = async (event) => {
    event.preventDefault();

    if (newAlbumTitle.trim() === '') {
      setError('Album title cannot be empty');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const response = await fetch('http://localhost:3000/albums');
      if (!response.ok) {
        throw new Error('Error fetching albums');
      }
      const allAlbums = await response.json();
      const newAlbumId = allAlbums.length === 0 ? "1" : (parseInt(allAlbums[allAlbums.length - 1].id) + 1).toString();
      const newAlbum = {
        userId: user.id,
        id: newAlbumId,
        title: newAlbumTitle
      };

      const addResponse = await fetch('http://localhost:3000/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlbum)
      });

      if (!addResponse.ok) {
        throw new Error('Error adding new album');
      }

      const createdAlbum = await addResponse.json();
      setAlbums([...albums, createdAlbum]);
      setNewAlbumTitle('');
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>User Albums</h2>
      <ul>
        {albums.map(album => (
          <li key={album.id}>
            <Link to={`album/${album.id}`}>
              {album.id}: {album.title}
            </Link>
          </li>
        ))}
      </ul>
      <h3>Add New Album</h3>
      <form onSubmit={handleAddAlbum}>
        <input
          type="text"
          placeholder="Album Title"
          value={newAlbumTitle}
          onChange={(e) => setNewAlbumTitle(e.target.value)}
        />
        <button type="submit">Add Album</button>
      </form>
    </div>
  );
}

export default Albums;