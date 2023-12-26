import imports from "../imports.js";
const { React } = imports;

export default function PublicHeader() {
  return (
    <header className="shadow">
      <div className="c p h-flex">
        <h1 className="mra">Tindog</h1>
        <imports.Link to={"/register"} className="btn mr">
          Sign Up
        </imports.Link>
        <imports.Link to={"/login"} className="btn">
          Sign in
        </imports.Link>
      </div>
    </header>
  );
}
