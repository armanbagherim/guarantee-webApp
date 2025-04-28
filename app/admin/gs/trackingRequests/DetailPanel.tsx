import concat from "@/app/components/utils/AddressConcat";


const detailPanel = (row) => {
    return (
        <div className="p-4 grid grid-cols-2 gap-4">
            <div>
                <strong>کاربر:</strong> {row?.original?.guaranteeRequest?.user?.firstname} {row?.original?.guaranteeRequest?.user?.lastname}
            </div>
            <div>
                <strong>شماره تلفن:</strong> {row?.original?.guaranteeRequest?.phoneNumber}
            </div>
            <div>
                <strong>محصول:</strong> {row?.original?.guaranteeRequest?.brand?.title} {row?.original?.guaranteeRequest?.variant?.title}
            </div>
            <div>
                <strong>نوع محصول:</strong> {row?.original?.guaranteeRequest?.productType?.title}
            </div>
            <div className="col-span-2">
                <strong>آدرس کاربر:</strong> {concat(row?.original?.guaranteeRequest?.address)}
            </div>
            {/* Add more details as needed */}
        </div>
    );
};


export default detailPanel;