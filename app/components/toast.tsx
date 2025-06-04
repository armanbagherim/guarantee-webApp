// toast.js
import Swal from "sweetalert2";

const toast = {
    error: (message) => {
        Swal.fire({
            icon: "error",
            title: "خطا",
            text: message,
            confirmButtonText: "بستن",
        });
    },
    success: (message) => {
        Swal.fire({
            icon: "success",
            title: "موفقیت‌آمیز",
            text: message,
            confirmButtonText: "عالیه",
        });
    },
};

export default toast;