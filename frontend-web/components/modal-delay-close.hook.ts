import { useEffect, useRef, useState } from "react";

export function useModalDelayClose(delay: number = 300) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const modalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (modalTimeoutRef.current) {
      clearTimeout(modalTimeoutRef.current);
    }

    if (isModalOpen) {
      setIsModalMounted(true);
    } else {
      modalTimeoutRef.current = setTimeout(() => {
        setIsModalMounted(false);
      }, delay);
    }

    return () => {
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
    };
  }, [isModalOpen]);

  return { isModalOpen, setIsModalOpen, isModalMounted };
}