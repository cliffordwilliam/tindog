import imports from "../imports.js";

export default function Register() {
  const dispatch = imports.useDispatch();
  const [name, setName] = imports.useState("");
  const [password, setPassword] = imports.useState("");

  function onLoginDone(data) {
    console.log(data);
  }

  const onLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(
      imports.request({
        method: "POST",
        url: `${imports.c.baseUrl}/user/login`,
        options: {
          data: {
            name,
            password,
          },
        },
        callback: onLoginDone,
      })
    );
  };

  return (
    <main>
      <form onSubmit={onLoginSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            required
          />
        </label>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
