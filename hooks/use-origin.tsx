import { useIsComponentMounted } from "./use-is-component-mounted";

export const useOrigin = () => {
  const { isMounted } = useIsComponentMounted();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  if (!isMounted) {
    return "";
  }

  return origin;
};
