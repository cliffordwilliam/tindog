import imports from "../imports.js";
const { React } = imports;

export default function PrivateHeader() {
  const navigate = imports.useNavigate();

  function onLogout(e) {
    e.preventDefault();
    // remove token from memory, go to login
    localStorage.removeItem("token");
    // go to login
    navigate("/login");
  }

  return (
    <header className="shadow">
      <div className="c p h-flex">
        <h1 className="mra">Tindog</h1>
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
