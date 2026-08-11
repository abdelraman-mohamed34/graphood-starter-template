'use client';

import {
    HydrationBoundary,
    QueryClientProvider,
    type DehydratedState,
} from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { getQueryClient } from '../react-query/get-query-client';


interface ProvidersProps {
    children: ReactNode;
    dehydratedState: DehydratedState;
}

export default function Providers({
    children,
    dehydratedState,
}: ProvidersProps) {
    const [queryClient] = useState(getQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
                {children}
            </HydrationBoundary>
        </QueryClientProvider>
    );
}
