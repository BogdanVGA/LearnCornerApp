import React from "react";

export const Modal: React.FC<{showModal: boolean, modalMessage: string, onClose: () => void}> = (props) => {
    return (
        <div className={`modal fade ${props.showModal ? "show" : ""}`} tabIndex={-1} aria-labelledby="modalLabel"
                aria-hidden={!props.showModal} style={{ display: props.showModal ? "block" : "none" }} >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">Information</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close" onClick={props.onClose}></button>
                        </div>
                        <div className="modal-body">
                            {props.modalMessage}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"
                                onClick={props.onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
    );
};
