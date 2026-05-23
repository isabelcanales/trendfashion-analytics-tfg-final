"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps, MouseEvent } from "react";
import { useRouteTransition } from "./RouteTransitionProvider";

type TransitionLinkProps = ComponentProps<typeof Link>;

export default function TransitionLink({
  href,
  onClick,
  target,
  ...props
}: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { startTransition } = useRouteTransition();

  const hrefString = typeof href === "string" ? href : href.toString();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === "_blank"
    ) {
      return;
    }

    const isExternal =
      hrefString.startsWith("http") ||
      hrefString.startsWith("mailto:") ||
      hrefString.startsWith("tel:");

    if (isExternal) {
      return;
    }

    if (hrefString === pathname) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    startTransition();

    setTimeout(() => {
      router.push(hrefString);
    }, 420);
  }

  return (
    <Link href={href} target={target} onClick={handleClick} {...props} />
  );
}