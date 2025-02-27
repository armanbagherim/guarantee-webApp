import * as Yup from "yup";

export const formSchema = Yup.object().shape({
  name: Yup.string().required("فیلد اجباری می باشد."),
});
