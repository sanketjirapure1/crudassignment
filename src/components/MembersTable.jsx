import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import {
  fetchAllMembers,
  deleteMember,
  createMember,
  fetchMemberById,
  updateMember,
} from "../services/api";
const customStyles = {
  headRow: {
    style: {
      background: "white",
      color: "black",
      fontWeight: "bold",
      borderTopLeftRadius: "0px", 
      borderTopRightRadius: "0px", 
      borderBottom: "solid 1px black", 
    },
  },
  rows: {
    style: {
      minHeight: "40px",
      borderBottom: "solid 1px black",
      "&:last-of-type": {
        borderBottom: "none",
      },
      "&:nth-child(even)": {
        backgroundColor: "#f2f2f2",
        borderRadius: "0px",
      },
      "&:nth-child(odd)": {
        backgroundColor: "white",
        borderRadius: "0px",
      },
    },
  },


  headCells: {
    style: {
      paddingLeft: "5px",
      paddingRight: "5px",
      borderRight: "solid 1px black",
    },
  },
  cells: {
    style: {
      borderRight: "solid 1px black",
    },
  },
  table: {
    style: {
      border: "solid 1px black",
      borderRadius: "0px",
    },
  },
};
const MemberTable = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMemberData, setEditingMemberData] = useState({
    name: "",
    email: "",
    age: "",
    parent_id: "",
  });
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    age: "",
    parent_id: "",
  });

  useEffect(() => {
    const getMembers = async () => {
      try {
        const response = await fetchAllMembers();
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    getMembers();
  }, []);

  useEffect(() => {
    const fetchMemberForEdit = async (id) => {
      try {
        const response = await fetchMemberById(id);
        const { name, email, age, parent_id } = response.data;
        setEditingMemberData({ name, email, age, parent_id });
        setShowModal(true);
      } catch (error) {
        console.error("Error fetching member for edit:", error);
        Swal.fire(
          "Error!",
          "There was an error fetching member data for edit.",
          "error"
        );
      }
    };

    if (editingMemberId) {
      fetchMemberForEdit(editingMemberId);
    }
  }, [editingMemberId]);




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingMemberId) {
      setEditingMemberData({ ...editingMemberData, [name]: value });
    } else {
      setNewMemberData({ ...newMemberData, [name]: value });
    }
  };

  const handleEdit = (id) => {
    setEditingMemberId(id);
  };

// Add Member
  const handleAddMember = async () => {
    try {
      const response = await createMember(newMemberData);
      setMembers([...members, response.data]);
      setShowModal(false);
      Swal.fire("Success!", "Member added successfully.", "success");
      setNewMemberData({
        name: "",
        email: "",
        age: "",
        parent_id: "",
      });
    } catch (error) {
      console.error("Error adding member:", error);
      Swal.fire("Error!", "There was an error adding the member.", "error");
    }
  };

// UpDate Member
  const handleUpdateMember = async () => {
    try {
      await updateMember(editingMemberId, editingMemberData);
      const updatedMembers = members.map((member) =>
        member._id === editingMemberId
          ? { ...member, ...editingMemberData }
          : member
      );
      setMembers(updatedMembers);
      setShowModal(false);
      Swal.fire("Success!", "Member updated successfully.", "success");
      setEditingMemberId(null);
      setEditingMemberData({
        name: "",
        email: "",
        age: "",
        parent_id: "",
      });
    } catch (error) {
      console.error("Error updating member:", error);
      Swal.fire("Error!", "There was an error updating the member.", "error");
    }
  };
    // Delete Member
    const handleDelete = async (id) => {
      Swal.fire({
        title: "Are you sure?",
        text: " If You delete this Member Then this action can not be undone",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteMember(id);
            setMembers(members.filter((member) => member._id !== id));
            Swal.fire("Deleted!", "The member has been deleted.", "success");
          } catch (error) {
            Swal.fire(
              "Error!",
              "There was an error deleting the member.",
              "error"
            );
          }
        }
      });
    };
  // Search Member
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const columns = [
    {
      name: "Id",
      selector: (row, index) => index + 1, 
      sortable: true,
      width: '100px',
    },

    {
      name: "Member Name",
      selector: (row) => row.name,
      sortable: true,
      width: '280px',
      cell: (row) => (
        <span onClick={() => handleEdit(row._id)}>{row.name}</span>
      ),
    },
    {
      name: "Member Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <span onClick={() => handleEdit(row._id)}>{row.email}</span>
      ),
    },
    { name: "Age", selector: (row) => row.age, sortable: true, width: '100px', },
    // { name: "Parent ID", selector: (row) => row.parent_id, sortable: true },
    {
      name: "Action",
      width: '150px',
      cell: (row) => (
        <>
          <button className="btn  m-1" onClick={() => handleEdit(row._id)}>
            <FontAwesomeIcon className="text-primary" icon={faEdit} />
          </button>
          <button className="btn m-1" onClick={() => handleDelete(row._id)}>
            <FontAwesomeIcon className="text-danger" icon={faTrash} />
          </button>
        </>
      ),
    },
  ];
 

  return (
    <div className="container-fluid m-1 bg-white">
      <div className="d-flex justify-content-between flex-wrap pb-3">
        <div className="col-12 col-md-2 m-2">
          <input
            type="search"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4 m-2 d-flex justify-content-md-end justify-content-start">
          <button
            className="btn btn-success"
            onClick={() => setShowModal(true)}
          >
            Add New Member
          </button>
        </div>
      </div>

      {/* <DataTable
        title=""
        columns={columns}
        data={filteredMembers}
        progressPending={loading}
        pagination
        // highlightOnHover
        responsive
        customStyles={customStyles}
      /> */}
       <DataTable
        title=""
        columns={columns}
        data={filteredMembers}
        progressPending={loading}
        pagination
        paginationComponentOptions={{
          rowsPerPageText: "Show :",
          rangeSeparatorText: "of",
          noRowsPerPage: false,
          selectAllRowsItem: false,
        }}
        responsive
        customStyles={customStyles}
      />
      

      {showModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingMemberId ? "Edit Member" : "Add New Member"}
                </h5>
                <button
                  type="button"
                  className="close"
                  // onClick={() => setShowModal(false)}
                  onClick={() => {
                    setShowModal(false);
                    setEditingMemberId(null);
                    setEditingMemberData({
                      name: "",
                      email: "",
                      age: "",
                      parent_id: "",
                    });
                    setNewMemberData({
                      name: "",
                      email: "",
                      age: "",
                      parent_id: "",
                    });
                  }}
                  style={{
                    border: "none",
                    position: "absolute",
                    right: "10px",
                    top: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label className="fw-semibold" htmlFor="name">
                      Member Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={
                        editingMemberId
                          ? editingMemberData.name
                          : newMemberData.name
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="fw-semibold" htmlFor="email">
                      Memebr Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={
                        editingMemberId
                          ? editingMemberData.email
                          : newMemberData.email
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="fw-semibold" htmlFor="age">
                      Member Age
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="age"
                      name="age"
                      value={
                        editingMemberId
                          ? editingMemberData.age
                          : newMemberData.age
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="fw-semibold" htmlFor="parent_id">
                      Member Parent ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="parent_id"
                      name="parent_id"
                      value={
                        editingMemberId
                          ? editingMemberData.parent_id
                          : newMemberData.parent_id
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex justify-content-center  bg-light">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={
                    editingMemberId ? handleUpdateMember : handleAddMember
                  }
                >
                  {editingMemberId ? "Update" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberTable;
