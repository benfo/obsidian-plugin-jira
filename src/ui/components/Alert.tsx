import { ComponentChildren, FunctionalComponent } from "preact";

type AlertProps = {
  variant?: "primary" | "secondary" | "success" | "error";
  children: ComponentChildren;
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
    error: {
      backgroundColor: "var(--background-modifier-error)",
      color: "var(--text-on-accent)",
    },
  },
  heading: {
    marginTop: 0,
  },
};

type AlartHeadingProps = {
  children: ComponentChildren;
};

const AlertHeading = ({ children }: AlartHeadingProps) => {
  return <h3 style={styles.heading}>{children}</h3>;
};

const Alert = ({ children, variant = "secondary" }: AlertProps) => {
  const style = {
    ...styles.base,
    ...styles.variants[variant],
  };

  return <div style={style}>{children}</div>;
};

export default Object.assign(Alert, {
  Heading: AlertHeading,
});
