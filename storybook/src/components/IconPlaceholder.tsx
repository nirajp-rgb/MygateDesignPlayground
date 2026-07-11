import { cx } from "./utils";

type IconPlaceholderProps = {
  className?: string;
};

export function IconPlaceholder({ className }: IconPlaceholderProps) {
  return <span aria-hidden="true" className={cx("ds-icon", className)} />;
}
