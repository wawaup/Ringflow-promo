import { theme } from "../../config/theme";

type ToastProps = {
  text: string;
  mode?: "light" | "dark";
};

export const Toast = ({ text, mode = "dark" }: ToastProps) => {
  const dark = mode === "dark";
  return (
    <div
      style={{
        maxWidth: 620,
        padding: "14px 20px",
        borderRadius: 999,
        background: dark ? "rgba(17,24,39,0.80)" : "rgba(255,255,255,0.76)",
        border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.78)",
        color: dark ? "#ffffff" : theme.colors.ink,
        fontSize: theme.type.label,
        lineHeight: 1.15,
        fontWeight: 680,
        letterSpacing: 0,
        boxShadow: "0 16px 42px rgba(15,23,42,0.22)",
        backdropFilter: "blur(18px)",
        overflowWrap: "anywhere",
      }}
    >
      {text}
    </div>
  );
};
