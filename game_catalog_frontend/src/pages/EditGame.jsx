import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';

export default function EditGame() {
  const { gameId } = useParams();
  let navigate = useNavigate();

  const [game, setGame] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    imageUrl: '',
    platforms: [],
    selectedPlatforms: [],
    developers: [],
    selectedDevelopers: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGame();
    fetchPlatforms();
    fetchDevelopers();
  }, []);

  const fetchGame = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/game/${gameId}`);
      const gameData = response.data;

      if (!gameData.platforms || !gameData.developer) {
        throw new Error('Invalid response data');
      }

      setGame({
        title: gameData.title,
        description: gameData.description,
        releaseDate: gameData.releaseDate,
        genre: gameData.genre,
        imageUrl: gameData.imageUrl,
        platforms: gameData.platforms.map((platform) => ({
          value: platform.id,
          label: platform.name,
        })),
        selectedPlatforms: gameData.platforms.map((platform) => platform.id),
        developers: [
          {
            value: gameData.developer.id,
            label: gameData.developer.name,
          },
        ],
        selectedDevelopers: [gameData.developer.id],
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await axios.get('http://localhost:8080/platforms');
      const platformsData = response.data;

      if (!platformsData) {
        throw new Error('Invalid response data');
      }

      setGame((prevGame) => ({
        ...prevGame,
        platforms: platformsData.map((platform) => ({
          value: platform.id,
          label: platform.name,
        })),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/developers');
      const developersData = response.data;

      if (!developersData) {
        throw new Error('Invalid response data');
      }

      setGame((prevGame) => ({
        ...prevGame,
        developers: developersData.map((developer) => ({
          value: developer.id,
          label: developer.name,
        })),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const onInputChange = (event) => {
    setGame({ ...game, [event.target.name]: event.target.value });
  };

  const onPlatformChange = (selectedOptions) => {
    const selectedPlatformIds = selectedOptions.map((option) => option.value);
    setGame({ ...game, selectedPlatforms: selectedPlatformIds });
  };

  const onDeveloperChange = (selectedOptions) => {
    const selectedDeveloperIds = selectedOptions.map((option) => option.value);
    setGame({ ...game, selectedDevelopers: selectedDeveloperIds });
  };

  const onImageUpload = (event) => {
    const file = event.target.files[0];
    setGame({ ...game, imageUrl: '', image: file }); // Update imageUrl and store the file object in the game state
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', game.title);
      formData.append('description', game.description);
      formData.append('releaseDate', game.releaseDate);
      formData.append('genre', game.genre);
      formData.append('image', game.image); // Append the image file directly
      formData.append('developer', game.selectedDevelopers[0]);
      game.selectedPlatforms.forEach((platformId) => {
        formData.append('platforms', platformId);
      });

      await axios.put(`http://localhost:8080/game/${gameId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2 className="mb-4">Edit Game</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the title"
                name="title"
                value={game.title}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                placeholder="Enter the description"
                name="description"
                value={game.description}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="releaseDate" className="form-label">
                Release Date
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the release date"
                name="releaseDate"
                value={game.releaseDate}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="genre" className="form-label">
                Genre
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the genre"
                name="genre"
                value={game.genre}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label">
                Image URL
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the image URL"
                name="imageUrl"
                value={game.imageUrl}
                onChange={onInputChange}
              />
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={onImageUpload}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="platforms" className="form-label">
                Platforms
              </label>
              <Select
                isMulti
                name="platforms"
                options={game.platforms}
                value={game.platforms.filter((platform) =>
                  game.selectedPlatforms.includes(platform.value)
                )}
                onChange={onPlatformChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="developers" className="form-label">
                Developers
              </label>
              <Select
                isMulti
                name="developers"
                options={game.developers}
                value={game.developers.filter((developer) =>
                  game.selectedDevelopers.includes(developer.value)
                )}
                onChange={onDeveloperChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
            <Link to="/" className="btn btn-danger">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
