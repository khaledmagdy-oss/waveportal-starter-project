import { useNavigate } from 'react-router-dom';
import '../styles.css';


const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Clear the token from localStorage
            localStorage.removeItem('email');
            alert('Logout successful!');
            // Redirect to the home page or another route after successful logout
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <header>
            <div className="navbar-container">
                <div className="contentNav">
                    {/* <Link to="/main">
                        <h1>Bach Proj</h1>
                    </Link> */}
                    <div className="buttonsNav">
                        <button className="btn-btn-secondary" onClick={handleGoBack}>
                            Go Back
                        </button>
                        <div className="filebuddy">
                            FileBuddy
                        </div>
                        <button className="btn btn-primary" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
