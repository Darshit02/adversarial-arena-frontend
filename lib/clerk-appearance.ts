import { dark } from "@clerk/themes";

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorBackground: "#15161B",
    colorText: "#EDEDF0",
    colorTextSecondary: "#A8ABB5",
    colorPrimary: "#7C7FE8",
    colorInputBackground: "#1D1F26",
    colorInputText: "#EDEDF0",
    colorDanger: "#C77B7B",
    borderRadius: "8px",
    fontFamily: "var(--font-inter), sans-serif",
  },
  elements: {
    formButtonPrimary:
      "bg-[#7C7FE8] hover:bg-[#8B8EF0] text-white font-medium py-2 rounded-[8px] transition-colors focus:ring-2 focus:ring-[#7C7FE8] focus:ring-offset-2 focus:ring-offset-[#15161B]",
    card: "bg-[#15161B] border border-[#2A2C34] shadow-none rounded-[12px]",
    headerTitle: "font-display text-2xl font-medium text-[#EDEDF0]",
    headerSubtitle: "text-[13px] text-[#A8ABB5]",
    formFieldLabel: "text-[12px] font-medium text-[#A8ABB5]",
    formFieldInput:
      "bg-[#1D1F26] border border-[#2A2C34] text-[#EDEDF0] rounded-[8px] focus:border-[#7C7FE8] focus:ring-1 focus:ring-[#7C7FE8]",
    footerActionLink: "text-[#7C7FE8] hover:text-[#8B8EF0]",
    socialButtonsBlockButton:
      "bg-[#1D1F26] border border-[#2A2C34] text-[#EDEDF0] hover:bg-[#24262E] rounded-[8px]",
    dividerLine: "bg-[#2A2C34]",
    dividerText: "text-[#6B6E78] text-[11px]",
  },
};
