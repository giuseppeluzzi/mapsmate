import { useMediaQuery } from "native-base";

export default function isTablet(): { isTablet: boolean; isPhone: boolean } {
  const [isTablet] = useMediaQuery({
    minWidth: 768,
  });

  return { isTablet, isPhone: !isTablet };
}
