figma.showUI(__html__, {
  width: 300,
  height: 500,
  themeColors: true,
});

figma.ui.onmessage = (message: unknown) => {
  console.log({ message });
};
