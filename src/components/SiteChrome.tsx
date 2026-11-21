import Link from "next/link";
import { site } from "@/content/site";

// A floating glass bar, like a visionOS ornament.
export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="ornament" aria-label="Main">
        <Link href="/" className="brand" aria-label={`${site.name}, home`}>
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Hussain Raza</span>
        </Link>
        <ul className="nav">
          <li>
            <Link href="/#engine">How it works</Link>
          </li>
          <li>
            <Link href="/#work">Work</Link>
          </li>
          <li>
            <Link href="/#experience">Experience</Link>
          </li>
          <li>
            <Link href="/#contact">Contact</Link>
          </li>
        </ul>
        <Link href="/#ask" className="nav-ask">
          Ask my AI
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>
          {site.role}, {site.location}
        </span>
      </div>
    </footer>
  );
}
