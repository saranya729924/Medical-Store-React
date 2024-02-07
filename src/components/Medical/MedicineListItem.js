import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

function MedicineListItem(props) {
  const user = useSelector((store) => store.auth.user);
  const token = user.token;
  const navigate = useNavigate();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);
  const [shouldRefreshList, setShouldRefreshList] = useState(false);

  function deleteMedicine(e) {
    e.preventDefault();

    setIsDeleteConfirmationVisible(false);

    axios
      .delete(`https://medicalstore.mashupstack.com/api/medicine/${props.medicine.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIsSuccessModalVisible(true);
        setShouldRefreshList(true);
      })
      .catch((error) => {
        console.error('Failed to delete medicine:', error);
      });
  }

  function handleCloseModal() {
    if (shouldRefreshList && props.refresh) {
      props.refresh();
      setShouldRefreshList(false);
    }

    setIsSuccessModalVisible(false);
  }

  function handleOpenDeleteConfirmation(e) {
    e.preventDefault();
    setIsDeleteConfirmationVisible(true);
  }

  function handleCloseDeleteConfirmation() {
    setIsDeleteConfirmationVisible(false);
  }

  const isExpired = new Date(props.medicine.expiry_date) < new Date();
  const nameColorStyle = isExpired ? { color: 'red' } : {};

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title" style={nameColorStyle}>
          {props.medicine.name} {isExpired && "(Expired)"}
        </h5>
        <button className="btn btn-danger float-right" onClick={handleOpenDeleteConfirmation}>
          Delete
        </button>

        <Link to={`/Medical/data/${props.medicine.id}/edit`} className="btn btn-secondary float-right">
          Edit
        </Link>

        <Link to={`/Medical/data/${props.medicine.id}`} className="btn btn-success float-right">
          View
        </Link>
      </div>

      <div
        className={`modal ${isDeleteConfirmationVisible ? 'show' : ''}`}
        role="dialog"
        style={{ display: isDeleteConfirmationVisible ? 'block' : 'none' }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Confirmation</h5>
              <button type="button" className="close" onClick={handleCloseDeleteConfirmation} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this medicine?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={deleteMedicine}>
                Yes
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCloseDeleteConfirmation}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal ${isSuccessModalVisible ? 'show' : ''}`}
        role="dialog"
        style={{ display: isSuccessModalVisible ? 'block' : 'none' }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Success</h5>
              <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Medicine deleted successfully!</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineListItem;
