export const delay = async (milliseconds = 2000) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, milliseconds);
  });
};
