/* eslint-disable no-prototype-builtins */
export default async (property) => {
  // console.log(`waiting for ${property}`)
  while (!window.hasOwnProperty(property)) {
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  // console.log(`${property} is defined`)
};
