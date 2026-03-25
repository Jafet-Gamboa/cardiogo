import { useState } from "react";

export const useAlert = () => {
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });

    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, 3000);
  };

  return { alert, showAlert };
};
