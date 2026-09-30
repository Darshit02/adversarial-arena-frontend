import { dark } from "@clerk/themes";

export const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorBackground: "#15161B",
    colorForeground: "#EDEDF0",
    colorText: "#EDEDF0",
    colorTextSecondary: "#A8ABB5",
    colorMutedForeground: "#A8ABB5",
    colorNeutral: "#EDEDF0",
    colorPrimary: "#7C7FE8",
    colorPrimaryForeground: "#FFFFFF",
    colorInput: "#1D1F26",
    colorInputBackground: "#1D1F26",
    colorInputForeground: "#EDEDF0",
    colorInputText: "#EDEDF0",
    colorDanger: "#C77B7B",
    borderRadius: "8px",
    fontFamily: "var(--font-inter), sans-serif",
  },
  elements: {
    // Form & Buttons
    formButtonPrimary:
      "bg-[#7C7FE8] hover:bg-[#8B8EF0] text-white font-medium py-2 rounded-[8px] transition-colors focus:ring-2 focus:ring-[#7C7FE8] focus:ring-offset-2 focus:ring-offset-[#15161B]",
    card: "bg-[#15161B] border border-[#2A2C34] shadow-none rounded-[12px] text-[#EDEDF0]",
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

    // UserButton Popover & User Profile (ensures high contrast white/light text)
    userButtonPopoverCard:
      "bg-[#15161B] border border-[#2A2C34] text-[#EDEDF0] shadow-2xl rounded-[12px]",
    userButtonPopoverMain: "text-[#EDEDF0]",
    userPreview: "text-[#EDEDF0]",
    userPreviewMainIdentifier: "text-[#EDEDF0] font-medium text-[14px]",
    userPreviewSecondaryIdentifier: "text-[#A8ABB5] text-[12px]",
    userButtonPopoverActionButton:
      "text-[#EDEDF0] hover:text-white hover:bg-[#1D1F26] rounded-[6px] transition-colors",
    userButtonPopoverActionButtonText:
      "text-[#EDEDF0] hover:text-white font-normal text-[13px]",
    userButtonPopoverActionButtonIcon:
      "text-[#A8ABB5] hover:text-[#EDEDF0]",
    userButtonPopoverFooter:
      "border-t border-[#2A2C34] bg-[#15161B] text-[#6B6E78]",
    userButtonPopoverCustomItemButton: "text-[#EDEDF0] hover:bg-[#1D1F26]",
  },
};
