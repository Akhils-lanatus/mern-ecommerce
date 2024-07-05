import { toast } from "react-hot-toast";

export const showToast = (type, msg) => {
  switch (type) {
    case "SUCCESS":
      toast.success(msg, {
        position: "bottom-right",
        duration: 3000,
        style: {
          backgroundColor: "#232323",
          color: "#fff",
        },
      });
      break;

    case "ERROR":
      toast.error(msg, {
        position: "bottom-right",
        duration: 3000,
        style: {
          backgroundColor: "red",
          color: "#fff",
        },
      });
      break;

    default:
      return false;
  }
};
