import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const MODAL_ROOT = document.querySelector('#modal-root');

const Modal = ({ onClose, children }) => {
  const backdropRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = e => {
      console.log(e);

      if (e.code !== 'Escape') {
        return;
      }

      onClose();
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onClose]);

  const handleBackdropClick = e => {
    if (backdropRef.current && e.target !== backdropRef.current) {
      return;
    }

    onClose();
  };

  return createPortal(
    <div
      className={styles.Overlay}
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className={styles.Modal}>{children}</div>
    </div>,
    MODAL_ROOT,
  );
};

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
