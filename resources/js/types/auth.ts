export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles: string[];
    permissions: string[];
    [key: string]: unknown;
};

export type Tenant = {
    id: number;
    name: string;
    subscription: Subscription | null;
};

export type Subscription = {
    id: number;
    status: string;
    expires_at: string;
    plan: SubscriptionPlan | null;
};

export type SubscriptionPlan = {
    id: number;
    name: string;
};

export type Auth = {
    user: User | null;
    tenant: Tenant | null;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */
