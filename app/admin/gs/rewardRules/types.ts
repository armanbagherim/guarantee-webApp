export interface VipBundleTypeOption {
    id: number;
    title: string;
}

export interface RewardRuleFormValues {
    title: string;
    rewardAmount: number | null;
    monthPeriod: number | null;
    validFrom: string | Date | null;
    validUntil: string | Date | null;
    isActive: boolean;
    description: string;
}

export interface EditModalState {
    open: boolean;
    id: string | null;
    active: boolean;
}

export interface RewardRuleRow {
    id: string;
    title: string;
    rewardAmount?: number;
    vipBundleType?: {
        id: number;
        title: string;
    };
    monthPeriod?: number;
    validFrom?: string;
    validUntil?: string;
    isActive?: boolean;
    description?: string;
}
