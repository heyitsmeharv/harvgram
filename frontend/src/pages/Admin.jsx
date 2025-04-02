import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Admin = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h2>Admin</h2>
      {user && user.loggedIn ? <p>You are logged in!</p> : <p>Loading...</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Admin;