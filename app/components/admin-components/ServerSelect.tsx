import React from "react";
import AsyncSelect from "react-select/async";
import { useSession } from "next-auth/react";

const ServerSelect = ({ type, init, setRequestBody, requestBody }) => {
  const { data: session } = useSession();

  // Transform the data prop to match the expected format
  const initialData = init?.result.map((item) => ({
    label: item.value,
    value: item.key,
  }));
  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };
  const loadOptions = debounce(async (inputValue, callback) => {
    if (!session) {
      return callback([]); // or return an empty array if session is not available
    }

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/v1/api/ecommerce/admin/discountConditionValues?conditionTypeId=${type}&orderBy=id&search=${encodeURIComponent(
        inputValue
      )}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );
    const data = await response.json();
    const transformedData = data.result.map((item) => ({
      label: item.value,
      value: item.key,
    }));
    callback(transformedData);
  }, 400);

  const handleChange = (selectedOption) => {
    setRequestBody({ ...requestBody, conditionValue: selectedOption.value });
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      onChange={handleChange}
      placeholder="جست و جو ..."
      defaultValue={initialData} // Set the initial data
    />
  );
};

export default ServerSelect;
