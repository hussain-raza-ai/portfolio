import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <div className="wrap">
        <h1 className="case-title">This page does not exist.</h1>
        <p className="case-summary">The link may be out of date. Everything I have built is on the home page.</p>
        <p className="hero-actions">
          <Link href="/" className="btn btn-primary">
            Go to the home page
          </Link>
        </p>
      </div>
    </section>
  );
}
