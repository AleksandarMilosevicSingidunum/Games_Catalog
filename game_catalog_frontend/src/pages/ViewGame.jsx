import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function ViewGame() {
  const { gameId } = useParams();

  const [game, setGame] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    imageUrl: '',
    platforms: [],
    developers: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  useEffect(() => {
    fetchGame();
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
        platforms: gameData.platforms,
        developers: [gameData.developer],
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const toggleShowAllPlatforms = () => {
    setShowAllPlatforms((prevShowAllPlatforms) => !prevShowAllPlatforms);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <img
                    src={game.imageUrl}
                    alt="Game"
                    className="img-fluid rounded"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-8">
                  <h3>{game.title}</h3>
                  <p>
                    <strong>Release Date:</strong> {game.releaseDate}
                  </p>
                  <p>
                    <strong>Genre:</strong> {game.genre}
                  </p>
                  <p>
                    <strong>Developer:</strong> {game.developers[0].name}
                  </p>
                  <p>
                    <strong>Platforms:</strong>
                  </p>
                  <ul className="list-group">
                    {game.platforms.slice(0, showAllPlatforms ? game.platforms.length : 3).map((platform) => (
                      <li key={platform.id} className="list-group-item">
                        {platform.name}
                      </li>
                    ))}
                  </ul>
                  {game.platforms.length > 3 && (
                    <button className="btn btn-link" onClick={toggleShowAllPlatforms}>
                      {showAllPlatforms ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p>
                  <strong>Description:</strong>
                </p>
                <p>{game.description}</p>
              </div>
              <Link to="/" className="btn btn-primary mt-4">
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
