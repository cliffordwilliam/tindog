import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function ForgotPassword() {
  const dispatch = imports.useDispatch();
  const [email, setEmail] = imports.useState("");

  const sendMail = (e) => {
    e.preventDefault();
    dispatch(
      imports.request({
        method: "POST",
        url: `${imports.c.baseUrl}/user/forgot-email`,
        options: {
          data: {
            email,
          },
        },
        isStart: true,
        isEnd: true,
      })
    );
  };

  return (
    <main className="p cc">
      <form className="sw br p2 shadow" onSubmit={sendMail}>
        <h3 className="mb">Reset Password</h3>
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
        <button className="mt align-self-end" type="submit">
          Reset by email
        </button>
      </form>
    </main>
  );
}
