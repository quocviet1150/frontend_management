export class GlobalConstants {
    public static genericError: string = "Đã xảy ra lỗi. Vui lòng thử lại sau"

    public static nameRegex: string = "[a-zA-Z0-9 ]*";

    public static userNameRegex: string = "";

    public static contactNumberRegex: string = "^[e0-9]{10,10}$";

    public static error: string = "error";

    public static unauthroized: string = "Bạn không phải là người được ủy quyền truy cập trang này";

    public static productExistError: "Sản phẩm đã tồn tại";

    public static ProductAdded: "Đã thêm sản phẩm thành công";

    public static emailRegex: string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
}