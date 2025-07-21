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

export const validateInventoryBatchActionSchema = Yup.object().shape({
    productId: Yup.string()
        .required("Vui lòng chọn sản phẩm"),

    quantity: Yup.number()
        .required("Vui lòng nhập số lượng")
        .min(1, "Số lượng phải lớn hơn 0")
        .integer("Số lượng phải là số nguyên")
        .typeError("Số lượng phải là số"),

    costPrice: Yup.number()
        .required("Vui lòng nhập giá nhập")
        .min(0, "Giá nhập không được âm")
        .typeError("Giá nhập phải là số"),

    expiryDate: Yup.string()
        .required("Vui lòng chọn ngày hết hạn")
        .test('is-future-date', 'Ngày hết hạn phải sau ngày hiện tại',
            value => value ? new Date(value) > new Date() : false),

    receivedDate: Yup.string()
        .nullable(),
});

export const validateEditShipSchema = Yup.object({
    name: Yup.string().required("Vui lòng nhập họ tên người nhận hàng"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
        .required("Vui lòng nhập số điện thoại"),
    address: Yup.string().required("Vui lòng nhập địa chỉ cụ thể"),
    province: Yup.object().shape({
        id: Yup.string().required("Vui lòng chọn tỉnh/thành phố"),
        name: Yup.string().required("Tên tỉnh/thành phố không được để trống"),
    }),
    district: Yup.object().shape({
        id: Yup.string().required("Vui lòng chọn quận/huyện"),
        name: Yup.string().required("Tên quận/huyện không được để trống"),
    }),
    ward: Yup.object().shape({
        id: Yup.string().required("Vui lòng chọn phường/xã"),
        name: Yup.string().required("Tên phường/xã không được để trống"),
    }),
});
