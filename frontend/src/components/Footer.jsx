import imports from "../imports.js";

export default function Footer() {
  return (
    <footer>
      <p>&copy; {new Date().getFullYear()} Tindog. All rights reserved.</p>
    </footer>
  );
}
