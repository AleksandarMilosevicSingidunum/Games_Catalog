import React, { useState, useEffect } from "react";
import axios from "axios";

function DeveloperPlatformManager() {
  const [developerName, setDeveloperName] = useState("");
  const [platformName, setPlatformName] = useState("");
  const [editDeveloperName, setEditDeveloperName] = useState("");
  const [editPlatformName, setEditPlatformName] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  useEffect(() => {
    fetchDevelopers();
    fetchPlatforms();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/developers");
      setDevelopers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/platforms");
      setPlatforms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeveloperNameChange = (event) => {
    setDeveloperName(event.target.value);
  };

  const handlePlatformNameChange = (event) => {
    setPlatformName(event.target.value);
  };

  const handleEditDeveloperNameChange = (event) => {
    setEditDeveloperName(event.target.value);
  };

  const handleEditPlatformNameChange = (event) => {
    setEditPlatformName(event.target.value);
  };

  const handleAddDeveloperClick = async (event) => {
    event.preventDefault();
    try {
      // Check if developer with the same name already exists (case-insensitive)
      const existingDeveloper = developers.find(
        (developer) => developer.name.toLowerCase() === developerName.toLowerCase()
      );
      if (existingDeveloper) {
        alert("Developer with the same name already exists!");
        return;
      }
  
      await axios.post("http://localhost:8080/developer", {
        name: developerName,
      });
      setDeveloperName("");
      alert("Developer added successfully!");
      fetchDevelopers();
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleAddPlatformClick = async (event) => {
    event.preventDefault();
    try {
      // Check if platform with the same name already exists (case-insensitive)
      const existingPlatform = platforms.find(
        (platform) => platform.name.toLowerCase() === platformName.toLowerCase()
      );
      if (existingPlatform) {
        alert("Platform with the same name already exists!");
        return;
      }
  
      await axios.post("http://localhost:8080/platform", {
        name: platformName,
      });
      setPlatformName("");
      alert("Platform added successfully!");
      fetchPlatforms();
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleEditDeveloper = (developer) => {
    setSelectedDeveloper(developer);
    setEditDeveloperName(developer.name);
  };

  const handleEditPlatform = (platform) => {
    setSelectedPlatform(platform);
    setEditPlatformName(platform.name);
  };

  const handleDeleteDeveloper = async (developerId) => {
    try {
      await axios.delete(`http://localhost:8080/developer/${developerId}`);
      alert("Developer deleted successfully!");
      fetchDevelopers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlatform = async (platformId) => {
    try {
      await axios.delete(`http://localhost:8080/platform/${platformId}`);
      alert("Platform deleted successfully!");
      fetchPlatforms();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeveloperFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8080/developer/${selectedDeveloper.id}`, {
        name: editDeveloperName,
      });
      setEditDeveloperName("");
      setSelectedDeveloper(null);
      alert("Developer updated successfully!");
      fetchDevelopers();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlatformFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8080/platform/${selectedPlatform.id}`, {
        name: editPlatformName,
      });
      setEditPlatformName("");
      setSelectedPlatform(null);
      alert("Platform updated successfully!");
      fetchPlatforms();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h2>Add Developer</h2>
          <form onSubmit={handleAddDeveloperClick}>
            <div className="mb-3">
              <label htmlFor="developerName" className="form-label">
                Developer Name
              </label>
              <input
                type="text"
                className="form-control"
                id="developerName"
                value={developerName}
                onChange={handleDeveloperNameChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Developer
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <h2>Add Platform</h2>
          <form onSubmit={handleAddPlatformClick}>
            <div className="mb-3">
              <label htmlFor="platformName" className="form-label">
                Platform Name
              </label>
              <input
                type="text"
                className="form-control"
                id="platformName"
                value={platformName}
                onChange={handlePlatformNameChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Platform
            </button>
          </form>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <h2>Developers</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {developers.map((developer) => (
                <tr key={developer.id}>
                  <td>{developer.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditDeveloper(developer)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteDeveloper(developer.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h2>Platforms</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((platform) => (
                <tr key={platform.id}>
                  <td>{platform.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEditPlatform(platform)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeletePlatform(platform.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedDeveloper && (
        <div className="row mt-4">
          <div className="col-md-6">
            <h2>Edit Developer</h2>
            <form onSubmit={handleDeveloperFormSubmit}>
              <div className="mb-3">
                <label htmlFor="editDeveloperName" className="form-label">
                  Developer Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="editDeveloperName"
                  value={editDeveloperName}
                  onChange={handleEditDeveloperNameChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Update Developer
              </button>
              <button
            className="btn btn-danger ms-2"
            onClick={() => {
              setSelectedDeveloper(null);
              setEditDeveloperName("");
            }}
          >
            Cancel
          </button>
            </form>
          </div>
        </div>
      )}
      {selectedPlatform && (
  <div className="row mt-4">
    <div className="col-md-6">
      <h2>Edit Platform</h2>
      <form onSubmit={handlePlatformFormSubmit}>
        <div className="mb-3">
          <label htmlFor="editPlatformName" className="form-label">
            Platform Name
          </label>
          <input
            type="text"
            className="form-control"
            id="editPlatformName"
            value={editPlatformName}
            onChange={handleEditPlatformNameChange}
            required
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Update Platform
          </button>
          <button
            className="btn btn-danger ms-2"
            onClick={() => {
              setSelectedPlatform(null);
              setEditPlatformName("");
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default DeveloperPlatformManager;
