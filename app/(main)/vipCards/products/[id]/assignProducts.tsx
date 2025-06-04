"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import toast from "@/app/components/toast";
import { useParams, useRouter } from "next/navigation";
import LightDataGridClient from "@/app/components/admin-components/LightDataGrid/LightDataGridClient";
import { LoadingIcon } from "@/app/components/design/icons";
import { fetcher } from "@/app/components/admin-components/fetcher";
import Swal from "sweetalert2";

export default function AssignProducts({ token }) {
  const theme = useTheme();
  const guaranteeId = useParams().id;
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [productType, setProductType] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSelectType, setCurrentSelectType] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [selectedProductTypeTitle, setSelectedProductTypeTitle] = useState("");
  const [selectedBrandTitle, setSelectedBrandTitle] = useState("");
  const [selectedVariantTitle, setSelectedVariantTitle] = useState("");

  const saveData = async () => {
    setSubmitLoading(true);
    try {
      const result = await fetcher({
        url: `/v1/api/guarantee/client/assignedProductGuarantees`,
        method: "POST",
        body: {
          guaranteeId: +guaranteeId,
          productTypeId: +productType,
          brandId: +selectedBrand,
          variantId: +selectedVariant,
        },
      });
      toast.success("درخواست با موفقیت ثبت شد.");
      fetchProducts();
      // Reset form
      setProductType(null);
      setSelectedBrand(null);
      setSelectedVariant(null);
      setSelectedProductTypeTitle("");
      setSelectedBrandTitle("");
      setSelectedVariantTitle("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v1/api/guarantee/client/assignedProductGuarantees/guarantee/${guaranteeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.result);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openModalSelect = (type) => {
    setCurrentSelectType(type);
    let endpoint = "";
    switch (type) {
      case "productType":
        endpoint = "/v1/api/guarantee/client/productTypes";
        break;
      case "brand":
        endpoint = "/v1/api/guarantee/client/brands";
        break;
      case "variant":
        endpoint = "/v1/api/guarantee/client/variants";
        break;
    }
    setEndpoint(endpoint);
    setModalOpen(true);
  };

  const handleSelectItem = (item) => {
    switch (currentSelectType) {
      case "productType":
        setProductType(item.id);
        setSelectedProductTypeTitle(item.title);
        break;
      case "brand":
        setSelectedBrand(item.id);
        setSelectedBrandTitle(item.title);
        break;
      case "variant":
        setSelectedVariant(item.id);
        setSelectedVariantTitle(item.title);
        break;
    }
    setModalOpen(false);
  };

  const modalColumns = [
    {
      accessorKey: "title",
      header: "عنوان",
    },
    {
      accessorKey: "actions",
      header: "",
      Cell: ({ row }) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSelectItem(row)}
        >
          انتخاب
        </Button>
      ),
    },
  ];

  const deleteProduct = async (id) => {
    try {
      const result = await Swal.fire({
        title: "مطمئن هستید؟",
        text: "با حذف این گزینه امکان بازگشت آن وجود ندارد",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "بله حذفش کن",
        cancelButtonText: "لغو",
      });

      if (result.isConfirmed) {
        const req = await fetcher({
          url: `/v1/api/guarantee/client/assignedProductGuarantees/${id}`,
          method: "DELETE",
        });
        toast.success("موفق");
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[25px] request">
      <div className="bg-red-100 mb-4 text-center text-red-700 py-2 px-4 rounded-lg">
        فقط محصولاتی که سال ساخت آن ها از سال ۱۳۸۵ به بعد باشد شامل شرایط
        گارانتی می باشد.
      </div>

      {/* Assign Product Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <TextField
          fullWidth
          placeholder="جست و جوی نوع محصول"
          onClick={() => openModalSelect("productType")}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => openModalSelect("productType")}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          value={selectedProductTypeTitle}
        />

        <TextField
          fullWidth
          placeholder="جست و جوی برند"
          onClick={() => openModalSelect("brand")}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => openModalSelect("brand")}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          value={selectedBrandTitle}
        />

        <TextField
          fullWidth
          placeholder="جست و جوی مدل دستگاه ها"
          onClick={() => openModalSelect("variant")}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <IconButton onClick={() => openModalSelect("variant")}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          value={selectedVariantTitle}
        />
      </div>

      <div className="relative mb-8">
        {submitLoading ? (
          <button className="bg-primary p-4 text-white rounded-2xl font-bold text-sm w-full">
            <LoadingIcon />
          </button>
        ) : (
          <button
            onClick={saveData}
            disabled={
              productType == null ||
              selectedBrand == null ||
              selectedVariant == null
            }
            className="bg-primary p-4 text-white rounded-2xl font-bold text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            اضافه کردن محصول
          </button>
        )}
      </div>

      {/* Products List Section */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">محصولات اضافه شده</h3>

        {productsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-lg p-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع محصول
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    برند
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مدل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.productType?.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.brand?.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.variant?.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            هیچ محصولی یافت نشد
          </div>
        )}
      </div>

      {/* Selection Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>
            جستجو و انتخاب{" "}
            {currentSelectType === "productType"
              ? "نوع محصول"
              : currentSelectType === "brand"
                ? "برند"
                : "مدل دستگاه"}
          </span>
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{ marginLeft: "auto" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <LightDataGridClient
            url={`${endpoint}`}
            columns={modalColumns}
            session={token.token}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary">
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
