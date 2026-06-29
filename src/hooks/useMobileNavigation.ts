export default function useMobileNavigation() {
  const scrollToPanel = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
  };

  return {
    scrollToPanel,
  };
}