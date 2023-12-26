import imports from "../imports.js";
const { React } = imports;

export default function Dialog() {
  const { data, loading, error } = imports.useSelector((state) => state.api);
  return (
    <dialog
      className={`sw br p2 ${
        data
          ? "ok-bg shadow"
          : error
          ? "bad-bg shadow"
          : loading
          ? "loading-bg"
          : ""
      }`}
    >
      {data && <h2 className="mb">Success</h2>}
      {error && <h2 className="mb">Error</h2>}
      {loading && <div className="loader"></div>}
      {data && <p>{data.message}</p>}
      {error && <p>{error}</p>}
      {!loading && (
        <button
          className="mt"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector("dialog").close();
          }}
        >
          Close
        </button>
      )}
    </dialog>
  );
}
