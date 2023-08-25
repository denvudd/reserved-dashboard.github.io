"use client";

import React from "react";
import { useIsComponentMounted } from "../../hooks/use-is-component-mounted";
import StoreModal from "../modals/StoreModal";

const ModalProvider: React.FC = ({}) => {
  const { isMounted } = useIsComponentMounted();

  // avoid the hydrations errors
  if (!isMounted) {
    return null;
  }

  return <StoreModal />;
};

export default ModalProvider;
