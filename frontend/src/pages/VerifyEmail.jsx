import imports from "../imports.js";
const { React } = imports;
import components from "../components.js";

export default function VerifyEmail() {
  const { email } = imports.useParams();
  return (
    <main className="p cc">
      <div className="sw br p2 shadow">
        <h3 className="mb">Verify email</h3>
        <p className="mb">
          Your email needs to be verified before using this site. Please check
          your email inbox.
        </p>
        <p className="p h-flex ok-bg">
          <span className="mr">✔</span>Email has been sent to: {email}
        </p>
      </div>
    </main>
  );
}
