import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function Register() {
  const navigate = imports.useNavigate();
  const dispatch = imports.useDispatch();
  const [email, setEmail] = imports.useState("");
  const [password, setPassword] = imports.useState("");

  function saveTokenKickHome(data) {
    localStorage.setItem("token", data.token);
    navigate("/");
  }

  const onLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(
      imports.request({
        method: "POST",
        url: `${imports.c.baseUrl}/user/login`,
        options: {
          data: {
            email,
            password,
          },
        },
        callback: saveTokenKickHome,
      })
    );
  };

  async function postGoogleLogin(codeResponse) {
    dispatch(
      imports.request({
        method: "POST",
        url: `${imports.c.baseUrl}/user/google-login`,
        options: {
          headers: {
            token: codeResponse.credential,
          },
        },
        callback: saveTokenKickHome,
      })
    );
  }

  return (
    <main className="p cc">
      <form className="sw br p2 shadow" onSubmit={onLoginSubmit}>
        <h3 className="mb">Sign in</h3>
        <div className="cc">
          <imports.GoogleLogin onSuccess={postGoogleLogin} />
        </div>
        <div className="h-flex align-center">
          <hr />
          <span className="p">or</span>
          <hr />
        </div>
        <p className="mb">
          Don't have an account?
          <imports.Link to={"/register"}>Please sign up.</imports.Link>
        </p>
        <label htmlFor="email">Email *</label>
        <input
          className="mb mt"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          required
        />
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
        <button className="mt align-self-end" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
}
