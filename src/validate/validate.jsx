import * as Yup from "yup";

export const validateForm = async ({ input, validateSchema, context = {} }) => {
    try {
        await validateSchema.validate(input, {
            abortEarly: false,
            context
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

export const validateProductActionSchema = Yup.object().shape({
    name: Yup.string()
        .trim()
        .required("Vui lòng nhập tên sản phẩm")
        .min(2, "Tên sản phẩm phải có ít nhất 2 ký tự")
        .max(100, "Tên sản phẩm không được vượt quá 100 ký tự"),

    price: Yup.number()
        .required("Vui lòng nhập giá sản phẩm")
        .min(0, "Giá sản phẩm không được âm")
        .typeError("Giá sản phẩm phải là số"),
        
    categories: Yup.array()
        .of(Yup.string())
        .nullable(),

    brandId: Yup.string()
        .required("Vui lòng chọn thương hiệu"),

    mainImageBase64: Yup.array()
        .of(Yup.string())
        .nullable(),

    mainImageUrl: Yup.string()
        .nullable(),

    additionalImagesBase64: Yup.array()
        .of(Yup.string())
        .nullable(),

    description: Yup.string()
        .nullable()
        .max(5000, "Mô tả không được vượt quá 5000 ký tự"),

    tags: Yup.array()
        .of(Yup.string())
        .nullable(),
});

export const validateBrandActionSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Vui lòng nhập tên thương hiệu")
});