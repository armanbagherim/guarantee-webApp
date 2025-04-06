import React, { useCallback, useState, useEffect, useRef } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';

interface OptionType {
  label: string;
  value: string | number;
  raw?: any;
}

interface ServerSelectProps {
  endpoint: string;
  queryParam?: string;
  searchParam?: string;
  labelKey?: string;
  valueKey?: string;
  initialData?: any[];
  onChange: (value: OptionType['value']) => void;
  placeholder?: string;
  defaultValue?: any;
  className?: string;
  isDisabled?: boolean;
  token?: string;
  value?: any;
  shouldLoadInitialOptions?: boolean;
}

const ServerSelect: React.FC<ServerSelectProps> = ({
  endpoint,
  queryParam = '',
  searchParam = 'search',
  labelKey = 'title',
  valueKey = 'id',
  initialData = [],
  onChange,
  placeholder = 'Search...',
  defaultValue,
  className,
  isDisabled = false,
  token,
  value,
  shouldLoadInitialOptions = true,
}) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [defaultOptions, setDefaultOptions] = useState<OptionType[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const hasInitialized = useRef(false);

  // Transform raw data to OptionType
  const transformData = useCallback((data: any[]): OptionType[] => {
    return data.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
      raw: item,
    }));
  }, [labelKey, valueKey]);

  // Get option from value
  const getOptionFromValue = useCallback((val: any, options: OptionType[]): OptionType | null => {
    if (!val) return null;
    return options.find(option => option.value === val) || null;
  }, []);

  // Function to load initial options
  const fetchInitialOptions = useCallback(async () => {
    if (!token || !shouldLoadInitialOptions) return;

    setIsLoadingInitial(true);
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`);
      if (queryParam) {
        url.searchParams.set('conditionTypeId', queryParam);
      }
      url.searchParams.set('orderBy', 'id');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch initial options');
      }

      const data = await response.json();
      const transformed = transformData(data.result || data);
      setDefaultOptions(transformed);

      if (defaultValue) {
        const option = getOptionFromValue(defaultValue, transformed);
        setSelectedOption(option);
      }
    } catch (error) {
      console.error('Error loading initial options:', error);
    } finally {
      setIsLoadingInitial(false);
    }
  }, [endpoint, queryParam, token, transformData, getOptionFromValue, shouldLoadInitialOptions, defaultValue]);

  // Search function with debounce
  const loadOptions = useCallback(
    (inputValue: string, callback: (options: OptionType[]) => void) => {
      if (!token) {
        callback([]);
        return;
      }

      const search = async () => {
        try {
          const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`);
          if (inputValue) {
            url.searchParams.set(searchParam, inputValue);
          }
          if (queryParam) {
            url.searchParams.set('conditionTypeId', queryParam);
          }
          url.searchParams.set('orderBy', 'id');

          const response = await fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch options');
          }

          const data = await response.json();
          const transformed = transformData(data.result || data);
          callback(transformed);
        } catch (error) {
          console.error('Error loading options:', error);
          callback([]);
        }
      };

      const debouncedSearch = debounce(search, 400);
      debouncedSearch();

      // Cleanup function
      return () => {
        debouncedSearch.cancel();
      };
    },
    [endpoint, queryParam, searchParam, token, transformData]
  );

  const handleChange = (selectedOption: OptionType | null) => {
    setSelectedOption(selectedOption);
    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    return newValue;
  };

  // Load initial options on mount
  useEffect(() => {
    if (hasInitialized.current) return;

    if (initialData && initialData.length > 0) {
      setDefaultOptions(transformData(initialData));
      hasInitialized.current = true;
    } else if (shouldLoadInitialOptions) {
      fetchInitialOptions();
      hasInitialized.current = true;
    }
  }, [initialData, shouldLoadInitialOptions, fetchInitialOptions, transformData]);

  return (
    <div className={className}>
      <AsyncSelect
        cacheOptions
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        onChange={handleChange}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        placeholder={placeholder}
        defaultValue={defaultValue ? getOptionFromValue(defaultValue, defaultOptions) : null}
        value={value ? getOptionFromValue(value, defaultOptions) : selectedOption}
        isDisabled={isDisabled || isLoadingInitial}
        isLoading={isLoadingInitial}
        loadingMessage={() => 'Loading...'}
        noOptionsMessage={({ inputValue }) =>
          inputValue ? 'No results found' : 'Start typing to search'
        }
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '75px',
            borderRadius: '20px',
          }),
        }}
        getOptionValue={(option) => option.value}
        getOptionLabel={(option) => option.label}
      />
    </div>
  );
};

export default ServerSelect;