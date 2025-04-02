import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <h2>Home</h2>
      {user ? <p>You are logged in!</p> : <p>Loading...</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;