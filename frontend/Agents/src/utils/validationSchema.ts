// utils/validationSchema.ts
import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  phone: Yup.string().matches(/^\d{11}$/, "Phone must be 11 digits").required("Phone is required"),
  address: Yup.string().required("Address is required"),
  dob: Yup.date().required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
  idType: Yup.string().oneOf(["NIN"], "Only NIN is accepted").required("ID Type is required"),
  idNumber: Yup.string().matches(/^\d{11}$/, "NIN must be 11 digits").required("ID number is required"),
  bankName: Yup.string().required("Bank name is required"),
  accountNumber: Yup.string().required("Account number is required"),
  accountName: Yup.string().required("Account name is required"),
  termStatus: Yup.boolean().oneOf([true], "Please accept the terms"),
  code: Yup.string().nullable(),
});
