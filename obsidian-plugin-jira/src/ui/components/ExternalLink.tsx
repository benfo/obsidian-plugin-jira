import { ComponentChildren } from "preact";

type Props = {
  children: ComponentChildren;
  href?: string;
};

const ExternalLink = ({ children, href }: Props) => {
  return (
    <a className="external-link" href={href}>
      {children}
    </a>
  );
};

export default ExternalLink;
