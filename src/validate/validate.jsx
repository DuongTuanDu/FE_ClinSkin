import * as Yup from "yup";

export const validateForm = async ({ input, validateSchema }) => {
    try {
        await validateSchema.validate(input, {
            abortEarly: false,
        });
        return {};
    } catch (validationErrors) {
        const errors = {};
        validationErrors.inner.forEach((error) => {
            errors[error.path] = error.message;
        });
        return errors;
    }
};

export const validateCategoryActionSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập tên danh mục")
        .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
        .max(100, "Tên danh mục không được vượt quá 100 ký tự"),

    level: Yup.number()
        .required("Vui lòng chọn cấp danh mục"),
});