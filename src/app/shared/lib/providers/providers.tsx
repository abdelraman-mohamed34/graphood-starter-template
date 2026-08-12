'use client';

import {
    HydrationBoundary,
    QueryClientProvider,
    type DehydratedState,
} from '@tanstack/react-query';
import { ReactNode, useState, createContext, useContext } from 'react';
import { getQueryClient } from '../react-query/get-query-client';

const TenantContext = createContext<string | null>(null);

interface ProvidersProps {
    children: ReactNode;
    dehydratedState: DehydratedState;
    tenantSlug?: string;
}

export default function Providers({
    children,
    dehydratedState,
    tenantSlug = '',
}: ProvidersProps) {
    const [queryClient] = useState(getQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
                <TenantContext.Provider value={tenantSlug}>
                    {children}
                </TenantContext.Provider>
            </HydrationBoundary>
        </QueryClientProvider>
    );
}

export const useTenantSlug = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenantSlug must be used within a Providers component');
    }
    return context;
};