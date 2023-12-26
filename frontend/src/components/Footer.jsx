import imports from "../imports.js";
const { React } = imports;

export default function Footer() {
  return (
    <footer className="shadow">
      <div className="c p">
        <p>&copy; {new Date().getFullYear()} Tindog. All rights reserved.</p>
      </div>
    </footer>
  );
}
