const validationStrategies = {
  twitter: (text) => {
    if (text.trim() === "") {
      return "Post cannot be empty.";
    }

    if (text.length > 280) {
      return "Twitter post cannot exceed 280 characters.";
    }

    return "";
  },

  linkedin: (text) => {
    if (text.trim() === "") {
      return "Post cannot be empty.";
    }

    if (text.length > 3000) {
      return "LinkedIn post cannot exceed 3000 characters.";
    }

    return "";
  },

  instagram: (text) => {
    if (text.trim() === "") {
      return "Post cannot be empty.";
    }

    if (text.length > 2200) {
      return "Instagram caption cannot exceed 2200 characters.";
    }

    return "";
  },
};

export default validationStrategies;