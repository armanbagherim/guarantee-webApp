import concat from "@/app/components/utils/AddressConcat";

const detailPanel = ({ row }) => {
    const request = row?.original?.guaranteeRequest;
    const activity = row?.original?.activity;
    const guarantee = request?.guarantee;
    const assignedGuarantee = guarantee?.assignedGuarantee;
    const additionalPackages = assignedGuarantee?.additionalPackages || [];

    return (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Request Information */}
            <div className="col-span-2 bg-gray-50 p-3 rounded-md">
                <h3 className="font-bold text-sm mb-2">اطلاعات درخواست</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div><strong>نوع درخواست:</strong> {request?.requestType?.title}</div>
                    <div><strong>دسته بندی:</strong> {request?.requestCategory?.title}</div>
                    <div><strong>شناسه درخواست:</strong> {request?.id}</div>
                    <div><strong>تاریخ ایجاد:</strong> {new Date(row?.original?.createdAt).toLocaleString('fa-IR')}</div>
                </div>
            </div>

            {/* User Information */}
            <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-bold text-sm mb-2">اطلاعات کاربر</h3>
                <div className="space-y-1">
                    <div><strong>نوع مشتری:</strong> {request?.user?.userType?.title}</div>
                    <div><strong>نام:</strong> {request?.user?.firstname} {request?.user?.lastname}</div>
                    <div><strong>{request?.user?.userType.id == 1 ? "کد ملی" : "شناسه ملی" } :</strong> {request?.user?.nationalCode || 'ثبت نشده'}</div>
                    <div><strong>شماره موبایل ثبت شده در فرم:</strong> {request?.phoneNumber}</div>
                    <div><strong>شماره موبایل کاربر :</strong> {request?.user?.phoneNumber}</div>                </div>
            </div>

            {/* Product Information */}
            <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-bold text-sm mb-2">اطلاعات محصول</h3>
                <div className="space-y-1">
                    <div><strong>برند:</strong> {request?.brand?.title}</div>
                    <div><strong>مدل:</strong> {request?.variant?.title}</div>
                    <div><strong>نوع محصول:</strong> {request?.productType?.title}</div>
                    <div><strong>شماره کارت گارانتی:</strong> {guarantee?.serialNumber}</div>
                </div>
            </div>

            {/* Additional Packages Section */}
            {additionalPackages.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-md">
                    <h3 className="font-bold text-sm mb-2">پکیج‌های اضافه</h3>
                    <div className="space-y-2">
                        {additionalPackages.map((pkg, index) => (
                            <div key={index} className="border-b border-gray-200 pb-2 last:border-0">
                                <div><strong>عنوان:</strong> {pkg.title}</div>
                                <div><strong>قیمت:</strong> {parseInt(pkg.price).toLocaleString('fa-IR')} تومان</div>
                                <div><strong>تاریخ ایجاد:</strong> {new Date(pkg.createdAt).toLocaleString('fa-IR')}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Address Information */}
            <div className="col-span-2 bg-gray-50 p-3 rounded-md">
                <h3 className="font-bold text-sm mb-2">آدرس</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div><strong>آدرس کامل:</strong> {concat(request?.address)}</div>
                    <div><strong>کد پستی:</strong> {request?.address?.postalCode}</div>
                    <div><strong>استان:</strong> {request?.address?.province?.name}</div>
                    <div><strong>شهر:</strong> {request?.address?.city?.name}</div>
                    <div><strong>محله:</strong> {request?.address?.neighborhood?.name}</div>
                </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-bold text-sm mb-2">اطلاعات ارسال</h3>
                <div className="space-y-1">
                    <div><strong>نحوه ارسال مشتری:</strong>
                        {request?.clientShipmentWay?.title || <span className="text-gray-500">تعیین نشده</span>}
                    </div>
                    <div><strong>کد رهگیری ارسال مشتری:</strong>
                        {request?.clientShipmentWayTrackingCode || <span className="text-gray-500">تعیین نشده</span>}
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200">
                        <strong>نحوه ارسال کارتابل:</strong>
                        {request?.cartableShipmentWay?.title || <span className="text-gray-500">تعیین نشده</span>}
                    </div>
                    <div>
                        <strong>کد رهگیری ارسال کارتابل:</strong>
                        {request?.cartableShipmentWayTrackingCode || <span className="text-gray-500">تعیین نشده</span>}
                    </div>
                </div>
            </div>

            {/* Activity Information */}
            <div className="bg-gray-50 p-3 rounded-md">
                <h3 className="font-bold text-sm mb-2">فعالیت جاری</h3>
                <div className="space-y-1">
                    <div><strong>نام فعالیت:</strong> {activity?.name}</div>
                    <div><strong>شناسه فعالیت:</strong> {activity?.id}</div>
                </div>
            </div>

        </div>
    );
};

export default detailPanel;