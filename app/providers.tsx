// app/providers.tsx
'use client';

import { SDKProvider } from '@telegram-apps/sdk-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SDKProvider>
      {children}
    </SDKProvider>
  );
}
