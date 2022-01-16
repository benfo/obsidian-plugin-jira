import { FunctionalComponent } from "preact";

type AlertProps = {
  variant?: "primary" | "secondary" | "success" | "error";
};

const styles = {
  base: {
    margin: "0.5rem 0",
    padding: "0.5rem",
    border: "1px solid var(--background-modifier-border)",
  },
  variants: {
    primary: { backgroundColor: "var(--background-primary)" },
    secondary: { backgroundColor: "var(--background-secondary)" },
    success: { backgroundColor: "var(--background-modifier-success)" },
    error: { backgroundColor: "var(--background-modifier-error)", color: "var(--text-on-accent)" },
  },
  heading: {
    marginTop: 0,
  },
};

const AlertHeading: FunctionalComponent = ({ children }) => {
  return <h3 style={styles.heading}>{children}</h3>;
};

const Alert: FunctionalComponent<AlertProps> = ({
  children,
  variant = "secondary",
}) => {
  const style = {
    ...styles.base,
    ...styles.variants[variant],
  };

  return <div style={style}>{children}</div>;
};

export default Object.assign(Alert, {
  Heading: AlertHeading,
});
