export function saveDraftMock(draft) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (draft.content.trim() === "") {
        reject(new Error("Draft content cannot be empty."));
      } else {
        resolve({
          success: true,
          message: "Draft saved successfully!",
          draft: draft,
        });
      }
    }, 1000);
  });
}