import { toast } from "react-hot-toast";

const getToastPosition = () => {
  const isMobile = window.innerWidth <= 768;
  return isMobile ? "top-center" : "bottom-right";
};

export const showToast = (type, msg) => {
  const position = getToastPosition();

  switch (type) {
    case "SUCCESS":
      toast.success(msg, {
        position,
        duration: 3000,
        style: {
          backgroundColor: "#232323",
          color: "#fff",
        },
      });
      break;

    case "ERROR":
      toast.error(msg, {
        position,
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
