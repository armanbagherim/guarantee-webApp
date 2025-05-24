import React, { useEffect, useState } from "react";
import Modal from "@/app/components/admin-components/Modal";
import Input from "@/app/components/admin-components/Input";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { fetcher } from "@/app/components/admin-components/fetcher";
import { toast, Toaster } from "react-hot-toast";

const DataHandler = ({ editData, loading, formik, setIsEdit }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [provinces, setProvinces] = useState([]);

  // Fetch provinces from the API
  const getProvinces = async () => {
    const result = await fetcher({
      url: "/v1/api/guarantee/client/provinces",
      method: "GET",
    });
    setProvinces(result.result);
  };

  useEffect(() => {
    getProvinces();
  }, []);

  // Function to add a new province to the provinceSolutions array
  const addProvince = () => {
    if (!selectedProvince) {
      toast.error("لطفاً یک استان را انتخاب کنید.");
      return;
    }

    const province = provinces.find((p) => p.id === parseInt(selectedProvince));
    if (!province) {
      toast.error("استان انتخاب شده معتبر نیست.");
      return;
    }

    // Check if the province is already added
    const isAlreadyAdded = formik.values.provinceSolutions.some(
      (p) => p.provinceId === province.id
    );
    if (isAlreadyAdded) {
      toast.error("این استان قبلاً اضافه شده است.");
      return;
    }

    // Add the new province to the list
    const newProvince = {
      provinceId: province.id,
      fee: 0,
      name: province.name,
    };
    const updatedProvinces = [...formik.values.provinceSolutions, newProvince];
    formik.setFieldValue("provinceSolutions", updatedProvinces);

    // Reset the selected province
    setSelectedProvince("");
  };

  // Function to remove a province from the provinceSolutions array
  const removeProvince = (index) => {
    const updatedProvinces = formik.values.provinceSolutions.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("provinceSolutions", updatedProvinces);
  };

  return (
    <>
      {/* Toast Container for displaying notifications */}
      <Toaster position="top-center" />

      <Modal
        loading={loading}
        title="افزودن / ویراش خدمات"
        handleClose={() => {
          formik.resetForm();
          setIsEdit({ active: false, id: null, open: false });
        }}
        maxSize="sm"
        isOpen={editData.open}
        handleAccept={formik.handleSubmit}
      >
        <form className="pt-4" onSubmit={formik.handleSubmit}>
          <div style={{ width: "100%" }}>
            <div className="flex gap-4">
              {/* Title Input */}
              <Input
                onChange={formik.handleChange}
                variant="outlined"
                value={formik.values.title || ""}
                label="عنوان خدمات"
                name="title"
                error={formik.errors.title && formik.touched.title}
                helperText={formik.touched.title && formik.errors.title}
                fullWidth
                margin="normal"
              />

              {/* Fee Input */}
              <Input
                onChange={(e) => formik.setFieldValue("fee", +e.target.value)}
                variant="outlined"
                value={formik.values.fee || ""}
                label="فی هزینه"
                name="fee"
                error={formik.errors.fee && formik.touched.fee}
                helperText={formik.touched.fee && formik.errors.fee}
                fullWidth
                margin="normal"
              />
            </div>

            {/* Province Selection Section */}
            <div className="mt-4">
              <Typography variant="h6" gutterBottom>
                انتخاب استان و هزینه
              </Typography>

              <div className="flex gap-4 items-end mb-4">
                {/* Province Dropdown */}
                <Select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  displayEmpty
                  fullWidth
                  variant="outlined"
                  margin="normal"
                >
                  <MenuItem value="" disabled>
                    استان را انتخاب کنید
                  </MenuItem>
                  {provinces.map((province) => (
                    <MenuItem key={province.id} value={province.id}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>

                {/* Add Province Button */}
                <Button
                  onClick={addProvince}
                  variant="contained"
                  color="primary"
                  style={{ height: "56px" }}
                >
                  افزودن
                </Button>
              </div>

              {/* Selected Provinces List */}
              {formik.values.provinceSolutions.map((province, index) => (
                <div key={index} className="flex gap-4 items-end mb-4">
                  {/* Province Name */}
                  <Typography variant="body1" style={{ flex: 1 }}>
                    {province.name ?? province.province.name}
                  </Typography>

                  <Input
                    onChange={formik.handleChange}
                    variant="outlined"
                    value={province.fee || ""}
                    label="هزینه"
                    name={`provinceSolutions[${index}].fee`}
                    fullWidth
                    margin="normal"
                  />

                  {/* Remove Province Button */}
                  <Button
                    onClick={() => removeProvince(index)}
                    variant="contained"
                    color="secondary"
                    style={{ marginBottom: "8px" }}
                  >
                    حذف
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default DataHandler;
