import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function Home() {
  return (
    <main>
      <header className="h-flex align-center rel hero">
        <div className="c p tw ts">
          <h2 className="hero-title">
            Welcome to <span className="tr">Tindog</span>
          </h2>
          <p>
            Find pets, pet sitter, lost pets, events, vets and cheap products
            here!
          </p>
        </div>
        <img className="bg" src={imports.hero} alt="hero" />
      </header>
    </main>
  );
}
