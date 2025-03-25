import logo from '../Sööder.jpg'
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function NavBar()
{
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  }
  return (
    <div className="App">
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-4">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" width="40" height="40" />
          </a>
          <a className="nav-link" href="/">Home</a>
          <a className="nav-link" href="/database">Database</a>
        </div>
        <div className="d-flex align-items-center gap-4">
            {!isLoggedIn ? (
                <>
                    <a className="nav-link" href="/register">Register</a>
                    <a className="nav-link" href="/login">Login</a>
                </>
            ) : (
                <>
                <a className="nav-link" href="/profile">Profile</a>
                <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </>
            )}
        </div>
      </div>
    </nav>
  </div>
    );
}

export default NavBar;