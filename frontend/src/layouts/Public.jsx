import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function Public() {
  return (
    <>
      <components.PublicHeader />
      <imports.Outlet />
      <components.Footer />
    </>
  );
}
