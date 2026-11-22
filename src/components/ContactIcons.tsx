import { Magnetic } from "@/components/Magnetic";
import { EmailButton } from "@/components/EmailButton";
import { ChatIcon, CodeIcon, DocIcon, MailIcon, ProfileIcon } from "@/components/Icons";
import { site } from "@/content/site";

// Round glass icons for every way to reach me. The label appears on hover and is
// read out by screen readers; the number and address stay off the page.
export function ContactIcons({ size = "md" }: { size?: "md" | "lg" }) {
  const iconSize = size === "lg" ? 24 : 20;
  return (
    <ul className={`contact-icons contact-icons-${size}`}>
      {site.whatsapp ? (
        <li>
          <Magnetic href={`https://wa.me/${site.whatsapp}`} className="icon-btn" label="WhatsApp" external strength={0.3}>
            <ChatIcon size={iconSize} />
          </Magnetic>
        </li>
      ) : null}
      {site.email ? (
        <li>
          <EmailButton className="icon-btn" label="Email">
            <MailIcon size={iconSize} />
          </EmailButton>
        </li>
      ) : null}
      <li>
        <Magnetic href={site.linkedin} className="icon-btn" label="LinkedIn" external strength={0.3}>
          <ProfileIcon size={iconSize} />
        </Magnetic>
      </li>
      {site.github ? (
        <li>
          <Magnetic href={site.github} className="icon-btn" label="GitHub" external strength={0.3}>
            <CodeIcon size={iconSize} />
          </Magnetic>
        </li>
      ) : null}
      {site.cv ? (
        <li>
          <Magnetic href={site.cv} className="icon-btn" label="Download CV" download strength={0.3}>
            <DocIcon size={iconSize} />
          </Magnetic>
        </li>
      ) : null}
    </ul>
  );
}
