import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center w-100">
            <Link className="navbar-brand" to="/">Game Catalog</Link>
            <div className="btn-group">
              <Link className="btn btn-info mx-2" to="/adddevplat">Add Developer/Platform</Link>
              <Link className="btn btn-info" to="/addgame">Add Game</Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
