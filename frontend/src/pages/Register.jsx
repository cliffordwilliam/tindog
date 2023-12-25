import imports from "../imports.js";

export default function Register() {
  const dispatch = imports.useDispatch();
  const [name, setName] = imports.useState("");
  const [password, setPassword] = imports.useState("");

  function onRegisterDone(data) {
    console.log(data);
  }

  const onRegisterSubmit = (e) => {
    e.preventDefault();
    dispatch(
      imports.request({
        method: "POST",
        url: `${imports.c.baseUrl}/user`,
        options: {
          data: {
            name,
            password,
          },
        },
        callback: onRegisterDone,
      })
    );
  };

  return (
    <main>
      <form onSubmit={onRegisterSubmit}>
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
        <button type="submit">Register</button>
      </form>
    </main>
  );
}
