export const capitalizeFirstLetter = (word: string) => {
  if (!word) return undefined;

  const capitalizedWord = `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

  return capitalizedWord;
};
