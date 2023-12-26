import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function Global() {
  return (
    <>
      <components.Dialog />
      <imports.Outlet />
    </>
  );
}
