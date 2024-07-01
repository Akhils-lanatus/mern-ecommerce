import { toast } from "react-toastify";
export const showToast = (type, msg) => {
  switch (type) {
    case "SUCCESS":
      toast.success(msg, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        draggable: false,
        theme: "dark",
      });
      break;

    case "ERROR":
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
        draggable: false,
        closeOnClick: true,
        theme: "colored",
      });

      break;

    default:
      return false;
  }
};
