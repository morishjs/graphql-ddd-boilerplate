export const isEncodedImage = (data: string) => {
  return !!data.match(/data:image.*/);
};
