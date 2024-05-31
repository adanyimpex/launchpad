import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";

type SocialLinksType = {
  facebook?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  instagram?: string;
  reddit?: string;
  youtube?: string;
};

export default function SocialLinks({ links }: { links: SocialLinksType }) {
  return (
    <div className="flex items-center gap-4">
      {links.facebook && (
        <a href={links.facebook} target="_blank">
          <FacebookIcon />
        </a>
      )}
      {links.twitter && (
        <a href={links.twitter} target="_blank">
          <TwitterIcon />
        </a>
      )}
      {links.instagram && (
        <a href={links.instagram} target="_blank">
          <InstagramIcon />
        </a>
      )}
    </div>
  );
}
