export const light = {
  alternate: {
    main: "#e8eaf6", // Light indigo
    dark: "#c5cae9", // Dark indigo
  },
  cardShadow: "rgba(23, 70, 161, .11)",
  mode: "light",
  primary: {
    main: "#5c6bc0", // Moderate blue
    light: "#8e99f3", // Lighter blue
    dark: "#26418f", // Dark blue
    contrastText: "#fff",
  },
  secondary: {
    light: "#ffcc80", // Soft orange
    main: "#ffa726", // Orange
    dark: "#c77800", // Dark orange
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  text: {
    primary: "#212121", // Dark grey for high contrast on light backgrounds
    secondary: "#37474f", // A slightly lighter shade of dark grey for secondary text
  },
  divider: "rgba(0, 0, 0, 0.12)",
  background: {
    paper: "#ffffff", // White background for paper
    default: "#eeeeee", // Light grey for default background
    level2: "#f5f5f5", // Lighter grey
    level1: "#ffffff", // White background for level1 elements
  },
};

export const dark = {
  alternate: {
    main: "#303f9f", // Dark indigo
    dark: "#283593", // Deeper indigo
  },
  cardShadow: "rgba(0, 0, 0, .11)",
  common: {
    black: "#000",
    white: "#fff",
  },
  mode: "dark",
  primary: {
    main: "#3949ab", // Dark blue
    light: "#6f74dd", // Lighter dark blue
    dark: "#00227b", // Very dark blue
    contrastText: "#fff",
  },
  secondary: {
    light: "#ffff6e", // Light yellow
    main: "#ffd600", // Yellow
    dark: "#c7a500", // Dark yellow
    contrastText: "rgba(0, 0, 0, 0.87)",
  },
  text: {
    primary: "#ffffff", // White text for readability
    secondary: "#b0bec5", // Light blue-grey
  },
  divider: "rgba(255, 255, 255, 0.12)",
  background: {
    paper: "#1c2331", // Very dark blue-grey
    default: "#101f33", // Dark blue-grey for default background
    level2: "#333", // Dark grey
    level1: "#242f40", // Dark blue-grey for level1 elements
  },
};
