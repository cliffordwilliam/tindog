import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function ResetPassword() {
  const { token } = imports.useParams();
  const dispatch = imports.useDispatch();
  const [password, setPassword] = imports.useState("");
  const [confirmPassword, setConfirmPassword] = imports.useState("");

  const putPassword = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      dispatch(
        imports.request({
          method: "PUT",
          url: `${imports.c.baseUrl}/user`,
          options: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              password,
            },
          },
          isEnd: true,
        })
      );
    }
  };

  return (
    <main className="p cc">
      <form className="sw br p2 shadow" onSubmit={putPassword}>
        <h3 className="mb">New Password</h3>
        <label htmlFor="password">Password *</label>
        <input
          className="mb mt"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          required
        />
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          className="mb mt"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          name="confirmPassword"
          required
        />
        <button className="mt align-self-end" type="submit">
          Sign Up
        </button>
      </form>
    </main>
  );
}
