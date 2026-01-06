'use client'
import React, { useState } from 'react';
import { fetcher } from '@/app/components/admin-components/fetcher';
import { X, Check, AlertCircle } from 'lucide-react';

interface DiscountCodePreviewResultDto {
  discountCodeId: bigint;
  discountCode: string;
  originalPrice: number;
  discountAmount: bigint;
  finalPrice: number;
  userPayAmount: number;
  canApply: boolean;
  error?: string;
}

interface DiscountCodeProps {
  vipBundleTypeId: number;
  onDiscountApplied: (discountData: DiscountCodePreviewResultDto) => void;
  onDiscountRemoved: () => void;
}

export default function DiscountCode({ vipBundleTypeId, onDiscountApplied, onDiscountRemoved }: DiscountCodeProps) {
  const [discountCode, setDiscountCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [discountData, setDiscountData] = useState<DiscountCodePreviewResultDto | null>(null);
  const [error, setError] = useState('');

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setError('لطفا کد تخفیف را وارد کنید');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetcher({
        method: 'POST',
        url: '/v1/api/guarantee/client/payVipBundles/preview',
        body: {
          vipBundleTypeId,
          discountCode: discountCode.trim()
        }
      });

      const discountResult = (response as any).result as DiscountCodePreviewResultDto;
      
      if (discountResult.canApply) {
        setDiscountData(discountResult);
        onDiscountApplied(discountResult);
      } else {
        setError(discountResult.error || 'کد تخفیف معتبر نیست');
      }
    } catch (err: any) {
      setError(err.message || 'خطا در اعتبارسنجی کد تخفیف');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountData(null);
    setDiscountCode('');
    setError('');
    onDiscountRemoved();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyDiscount();
    }
  };

  if (discountData) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-800">کد تخفیف اعمال شد</span>
          </div>
          <button
            onClick={handleRemoveDiscount}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">کد تخفیف:</span>
            <span className="font-medium">{discountData.discountCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">قیمت اصلی:</span>
            <span className="font-medium">{discountData.originalPrice.toLocaleString()} تومان</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">مبلغ تخفیف:</span>
            <span className="font-medium text-green-600">{Number(discountData.discountAmount).toLocaleString()} تومان</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-green-200">
            <span>مبلغ نهایی:</span>
            <span className="text-green-700">{discountData.finalPrice.toLocaleString()} تومان</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="font-bold mb-3 text-right">کد تخفیف:</p>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={discountCode}
          onChange={(e) => {
            setDiscountCode(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          placeholder="کد تخفیف را وارد کنید"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right"
          dir="ltr"
        />
        
        <button
          onClick={handleApplyDiscount}
          disabled={isLoading || !discountCode.trim()}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[100px]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            'اعمال'
          )}
        </button>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
