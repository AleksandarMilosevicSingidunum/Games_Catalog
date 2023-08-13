  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import SearchBar from '../components/SearchBar';
  import {  useNavigate } from 'react-router-dom';

  export default function Home() {
    const [games, setGames] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
      fetchGames();
    }, []);

    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:8080/games');
        const gamesData = response.data;
        setGames(gamesData);
      } catch (error) {
        console.error(error);
      }
    };

    const handleSearch = async (searchInput) => {
      try {
        const response = await axios.get('http://localhost:8080/games');
        const gamesData = response.data;
    
        const searchInputs = searchInput.toLowerCase().trim();
    
        const filteredGames = gamesData.filter((game) => {
          const platformNames = game.platforms.map((platform) =>
            platform.name.toLowerCase()
          );
          const platformMatch = platformNames.some((name) =>
            name.includes(searchInputs)
          );
    
          const developerMatch =
            game.developer &&
            game.developer.name.toLowerCase().includes(searchInputs);
    
          const titleMatch = game.title.toLowerCase().includes(searchInputs);
    
          const genreMatch =
            game.genre && game.genre.toLowerCase().includes(searchInputs);
    
          return platformMatch || developerMatch || titleMatch || genreMatch;
        });
    
        setGames(filteredGames);
      } catch (error) {
        console.error(error);
      }
    };
    
    
    const handleViewClick = (gameId) => {
      navigate(`/viewgame/${gameId}`); // Navigate to the ViewGame component with the gameId
    };

    const handleEditClick = (gameId) => {
      navigate(`/editgame/${gameId}`);
    };

    const handleDeleteClick = (gameId) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this game?');
      if (confirmDelete) {
        deleteGame(gameId);
      }
    };

    const deleteGame = async (gameId) => {
      try {
        await axios.delete(`http://localhost:8080/game/${gameId}`);
        fetchGames();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div className="container">
        <SearchBar onSearch={handleSearch} />
        <h2 className="text-center m-4">Games</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5">
          {games.map((game) => (
            <div
              key={game.id}
              className="col mb-4"
              style={{
                minWidth: '150px',
                maxWidth: '250px',
              }}
            >
              <div className="card h-100">
                <img
                  src={game.imageUrl}
                  className="card-img-top"
                  alt={game.title}
                  onClick={() => handleViewClick(game.id)}
                  style={{ cursor: 'pointer', height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{game.title}</h5>
                  <p className="card-text mb-3">
                    <strong>Genre:</strong> {game.genre}
                  </p>
                  <p className="card-text mb-3">
                    <strong>Platforms:</strong>{' '}
                    {game.platforms
                      .slice(0, 3) 
                      .map((platform) => platform.name)
                      .join(', ')}
                    {game.platforms.length > 3 && '...'}
                  </p>
                  <div className="mt-auto d-flex justify-content-between">
                    <button
                      className="btn btn-primary btn-lg w-50 mr-2"
                      onClick={() => handleEditClick(game.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-lg w-50"
                      onClick={() => handleDeleteClick(game.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
