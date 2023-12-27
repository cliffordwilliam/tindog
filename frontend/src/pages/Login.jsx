import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function Register() {
  const navigate = imports.useNavigate();
  const dispatch = imports.useDispatch();
  const [email, setEmail] = imports.useState("");
  const [password, setPassword] = imports.useState("");
  const [captchaResult, setCaptchaResult] = imports.useState("");

  function updateCaptchaResult(data) {
    setCaptchaResult(data.obj.success);
  }

  function onCaptchaChange(value) {
    // TODO: this is development only! move to production later
    dispatch(
      imports.request({
        method: "POST",
        url: `${imports.c.baseUrl}/user/captcha`,
        options: {
          data: {
            value,
          },
        },
        isStart: true,
        callback: updateCaptchaResult,
      })
    );
  }

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
        <imports.ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          onChange={onCaptchaChange}
        />
        <div className="h-flex mt align-center">
          <imports.Link className="mra" to={"/forget-password"}>
            Forget Password
          </imports.Link>
          <button type="submit" disabled={!captchaResult}>
            Sign in
          </button>
        </div>
      </form>
    </main>
  );
}
