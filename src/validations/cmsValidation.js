import * as Yup from "yup";

export const contactUsSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: Yup.string().trim().email("Enter a valid email address").required("Email is required"),
  subject: Yup.string().trim().required("Subject is required"),
  message: Yup.string()
    .trim()
    .required("Message is required")
    .max(250, "Message cannot exceed 250 characters"),
});