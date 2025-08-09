// ✅ Add this line
export const getFriendlyError = (error) => {
  switch (error.code) {
    case "storage/unauthorized":
      return "You don't have permission to upload this file.";
    case "storage/canceled":
      return "Upload was canceled.";
    case "storage/retry-limit-exceeded":
      return "Retry limit exceeded. Please try again.";
    case "storage/quota-exceeded":
      return "Storage limit reached. Contact admin.";
    case "storage/network-request-failed":
      return "Network issue. Please check your internet.";
    default:
      return "Something went wrong during upload.";
  }
};
