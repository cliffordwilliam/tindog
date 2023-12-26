import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function Private() {
  return (
    <>
      <components.PrivateHeader />
      <imports.Outlet />
      <components.Footer />
    </>
  );
}
