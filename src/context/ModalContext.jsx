'use client';

import Modal from '@/components/common/Modal';
import {createContext, useCallback, useContext, useState} from 'react';

const ModalContext = createContext();

export function ModalProvider({children}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = useCallback(content => {
    setModalContent(content);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setModalContent(null);
  }, []);

  return (
    <ModalContext.Provider
      value={{isOpen, modalContent, openModal, closeModal}}
    >
      {children}
      <Modal />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within ModalProvider');

  return context;
};
