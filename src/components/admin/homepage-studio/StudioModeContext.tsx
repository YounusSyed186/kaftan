'use client';

import React, { createContext, useContext } from 'react';

const StudioModeContext = createContext<boolean>(false);

export function StudioModeProvider({
  isEditorMode,
  children,
}: {
  isEditorMode: boolean;
  children: React.ReactNode;
}) {
  return (
    <StudioModeContext.Provider value={isEditorMode}>
      {children}
    </StudioModeContext.Provider>
  );
}

export function useStudioMode(): boolean {
  return useContext(StudioModeContext);
}

