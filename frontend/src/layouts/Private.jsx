import imports from "../imports.js";

export default function Private() {
  return (
    <>
      <imports.PrivateHeader />
      <imports.Outlet />
      <imports.Footer />
    </>
  );
}
