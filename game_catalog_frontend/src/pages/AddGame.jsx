import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';

export default function AddGame() {
  let navigate = useNavigate();
  const [game, setGame] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    developer_Id: '',
    image: null,
    developers: [],
    platforms: [],
    selectedPlatforms: []
  });

  useEffect(() => {
    fetchDevelopers();
    fetchPlatforms();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/developers');
      const developers = response.data;
      setGame((prevGame) => ({
        ...prevGame,
        developers: developers,
        developer_Id: developers.length > 0 ? developers[0].id : ''
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await axios.get('http://localhost:8080/platforms');
      const platforms = response.data;
      setGame((prevGame) => ({
        ...prevGame,
        platforms: platforms,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const onInputChange = (e) => {
    if (e.target.name === 'image') {
      setGame({ ...game, [e.target.name]: e.target.files[0] });
    } else if (e.target.name === 'developer_Id') {
      setGame({ ...game, developer_Id: e.target.value });
    } else if (e.target.name === 'platforms') {
      const platformId = e.target.value;
      const selectedPlatforms = [...game.selectedPlatforms];
      if (e.target.checked) {
        selectedPlatforms.push(platformId);
      } else {
        const index = selectedPlatforms.indexOf(platformId);
        if (index > -1) {
          selectedPlatforms.splice(index, 1);
        }
      }
      setGame({ ...game, selectedPlatforms: selectedPlatforms });
    } else {
      setGame({ ...game, [e.target.name]: e.target.value });
    }
  };

  const handlePlatformSelect = (selectedOptions) => {
    const selectedPlatforms = selectedOptions.map((option) => option.value);
    setGame({ ...game, selectedPlatforms: selectedPlatforms });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', game.title);
    formData.append('description', game.description);
    formData.append('releaseDate', game.releaseDate);
    formData.append('genre', game.genre);
    formData.append('developer', game.developer_Id);
    game.selectedPlatforms.forEach((platformId) => {
      formData.append('platforms', platformId);
    });
    formData.append('image', game.image, game.image.name);

    try {
      await axios.post('http://localhost:8080/game', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Add Game</h2>
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
              <input
                type="text"
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
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="developer_Id" className="form-label">
                Developer
              </label>
              <select
                className="form-select"
                name="developer_Id"
                value={game.developer_Id}
                onChange={onInputChange}
                required
              >
                {game.developers &&
                  game.developers.map((developer) => (
                    <option key={developer.id} value={developer.id}>
                      {developer.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="platforms" className="form-label">
                Platforms
              </label>
              <Select
                isMulti
                name="platforms"
                options={game.platforms.map((platform) => ({
                  value: platform.id,
                  label: platform.name
                }))}
                value={game.selectedPlatforms.map((platformId) => ({
                  value: platformId,
                  label: game.platforms.find((platform) => platform.id === platformId).name
                }))}
                onChange={handlePlatformSelect}
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Submit
            </button>
            <Link to="/" className="btn btn-outline-danger mx-2">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
