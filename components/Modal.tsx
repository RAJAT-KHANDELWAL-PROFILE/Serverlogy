import { Dispatch, MouseEvent, ReactNode, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/Modal.module.css";
import { AiOutlineCloseCircle } from "react-icons/ai"


type ModalProps = {
  children: ReactNode
  show: Boolean
  setShow: Dispatch<SetStateAction<Boolean>>
};

const Modal = ({
  children,
  show,
  setShow
}: ModalProps) => {

    const close = () => setShow(false)

    if (show) {
        return (
            <div className={styles.modal}>

                <div className={styles.modalContent}>
                    <button onClick={close} className={styles.modalClose}>
                        <AiOutlineCloseCircle />
                    </button>

                    {children}
                </div>

            </div>
        )
    }

    else {
        return <></>
    }

};

Modal.defaultProps = {
  outline: false,
  rounded: false,
  className: "",
  transform: "none",
  disabled: false,
  type: "button"
};

export default Modal;
