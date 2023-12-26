import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function ConfirmEmail() {
  const { token } = imports.useParams();

  imports.useEffect(() => {
    localStorage.setItem("token", token);
  }, []);

  return (
    <main className="p cc">
      <div className="sw br p2 shadow">
        <h3 className="mb">Congratulations!</h3>
        <p className="mb">Account is verified.</p>
        <imports.Link to={"/"} className="btn">
          Open Dashboard
        </imports.Link>
      </div>
    </main>
  );
}
