import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function Register() {
  const navigate = imports.useNavigate();
  const dispatch = imports.useDispatch();
  const [email, setEmail] = imports.useState("");
  const [name, setName] = imports.useState("");
  const [password, setPassword] = imports.useState("");
  const [confirmPassword, setConfirmPassword] = imports.useState("");
  const [agreeTerms, setAgreeTerms] = imports.useState(false);

  function saveTokenKickHome(data) {
    localStorage.setItem("token", data.token);
    navigate("/");
  }

  function kickVerifyEmail(data) {
    navigate(`/verify-email/${email}`);
  }

  function sendMail(data) {
    dispatch(
      imports.request({
        method: "POST",
        url: `${imports.c.baseUrl}/user/login-email`,
        options: {
          data: {
            email,
            password,
          },
        },
        isStart: true,
        isEnd: false,
        callback: kickVerifyEmail,
      })
    );
  }

  const postUser = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      dispatch(
        imports.request({
          method: "POST",
          url: `${imports.c.baseUrl}/user`,
          options: {
            data: {
              name,
              email,
              password,
            },
          },
          callback: sendMail,
        })
      );
    }
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
      <form className="sw br p2 shadow" onSubmit={postUser}>
        <h3 className="mb">Sign up</h3>
        <div className="cc">
          <imports.GoogleLogin onSuccess={postGoogleLogin} />
        </div>
        <div className="h-flex align-center">
          <hr />
          <span className="p">or</span>
          <hr />
        </div>
        <p className="mb">
          Already have an account?
          <imports.Link to={"/login"}>Please sign in.</imports.Link>
        </p>
        <label htmlFor="name">Name *</label>
        <input
          className="mb mt"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          required
        />
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
        <label className="mb mt h-flex align-center">
          <input
            className="mr"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            required
          />
          I agree with
          <imports.Link to={"/terms"}>Terms</imports.Link>
          of use and
          <imports.Link to={"https://www.preferred.jp/en/policy/"}>
            Privacy policy.
          </imports.Link>
        </label>
        <p className="mb">
          Clicking the "Sign Up" button implies the agreement on the followings:
        </p>
        <ul>
          <li>
            I've read
            <imports.Link to={"/guidelines"}>Tindog Guidelines</imports.Link>
            and agree with it.
          </li>
        </ul>
        <button className="mt align-self-end" type="submit">
          Sign Up
        </button>
      </form>
    </main>
  );
}
