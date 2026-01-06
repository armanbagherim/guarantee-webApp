export interface DiscountType {
    id: number;
    title: string;
}

export interface DiscountCodeFormValues {
    code: string;
    title: string;
    discountTypeId: number | null;
    discountValue: number | null;
    totalUsageLimit: number | null;
    perUserUsageLimit: number | null;
    maxDiscountAmount: number | null;
    validFrom: string | null;
    validUntil: string | null;
    isActive: boolean;
    description: string;
}

export interface EditModalState {
    open: boolean;
    id: string | null;
    active: boolean;
}

export interface DiscountCodeRow {
    id: string;
    code: string;
    title: string;
    discountType?: {
        id: number;
        title: string;
    };
    discountTypeId?: number;
    discountValue?: number;
    totalUsageLimit?: number;
    perUserUsageLimit?: number;
    maxDiscountAmount?: number;
    validFrom?: string;
    validUntil?: string;
    isActive?: boolean;
    organizationId?: string;
    organizationName?: string;
    organization?: {
        id: string;
        name: string;
    };
    description?: string;
}
