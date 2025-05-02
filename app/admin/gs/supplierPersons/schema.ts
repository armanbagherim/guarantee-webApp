import { SpecialCharacters } from "@/app/components/global/Regex/SpecialCharrecters";
import * as Yup from "yup";

export const formSchema = Yup.object().shape({
    userId: Yup.number().required("فیلد اجباری می باشد."),
    bankName: Yup.string().required("فیلد اجباری می باشد.").matches(SpecialCharacters, "شامل کاراکترهای غیرمجاز است"),
    creditCardNumber: Yup.string().required("فیلد اجباری می باشد.").matches(SpecialCharacters, "شامل کاراکترهای غیرمجاز است"),
    iban: Yup.string().required("فیلد اجباری می باشد.").matches(SpecialCharacters, "شامل کاراکترهای غیرمجاز است"),
  });