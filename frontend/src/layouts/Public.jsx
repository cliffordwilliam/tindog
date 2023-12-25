import imports from "../imports.js";

export default function Public() {
  return (
    <>
      <imports.PublicHeader />
      <imports.Outlet />
      <imports.Footer />
    </>
  );
}
