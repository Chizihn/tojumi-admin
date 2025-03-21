"use client";
import {
  CREATE_CARESERVICETYPE,
  DELETE_CARESERVICETYPE,
  UPDATE_CARESERVICETYPE,
} from "@/graphql/mutations";
import { GET_ALL_CARESERVICETYPES } from "@/graphql/queries";
import { useCareServiceTypeStore } from "@/store/useCareServiceTypeStore";
import { CareServiceType } from "@/types";
import { useMutation, useQuery } from "@apollo/client";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [newTypeName, setNewTypeName] = useState<string>("");
  const [editingType, setEditingType] = useState<CareServiceType | null>(null);
  const [deletingTypeId, setDeletingTypeId] = useState<string | null>(null); // Track which service type is being deleted

  // Access Zustand store
  const {
    careServiceTypes,
    setCareServiceTypes,
    addServiceType,
    updateServiceType,
    removeServiceType,
  } = useCareServiceTypeStore();

  // Apollo queries and mutations
  const { loading, error, data } = useQuery(GET_ALL_CARESERVICETYPES, {
    fetchPolicy: "network-only",
  });

  const [createCareServiceType, { loading: createLoading }] = useMutation(
    CREATE_CARESERVICETYPE,
    {
      onCompleted: (data) => {
        addServiceType(data.createCareServiceType);
        setNewTypeName("");
        toast.success("Service type created successfully!");
      },
      onError: (err) => {
        toast.error(`Error creating service type: ${err.message}`);
      },
    }
  );

  const [updateCareServiceTypeMutation, { loading: updateLoading }] =
    useMutation(UPDATE_CARESERVICETYPE, {
      onCompleted: () => {
        setEditingType(null);
        toast.success("Service type updated successfully!");
      },
      onError: (err) => {
        toast.error(`Error updating service type: ${err.message}`);
      },
    });

  const [deleteCareServiceType, { loading: deleteLoading }] = useMutation(
    DELETE_CARESERVICETYPE,
    {
      onCompleted: () => {
        toast.success("Service type deleted successfully!");
        setDeletingTypeId(null); // Reset deleting type id after completion
      },
      onError: (err) => {
        toast.error(`Error deleting service type: ${err.message}`);
        setDeletingTypeId(null); // Reset deleting type id on error
      },
    }
  );

  // Load data into store on initial fetch
  useEffect(() => {
    if (data && data.getAllCareServiceTypes) {
      setCareServiceTypes(data.getAllCareServiceTypes);
    }
  }, [data, setCareServiceTypes]);

  // Handle form submissions
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTypeName.trim()) {
      createCareServiceType({ variables: { name: newTypeName.trim() } });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType && editingType.name.trim()) {
      updateCareServiceTypeMutation({
        variables: {
          id: editingType.id,
          name: editingType.name.trim(),
        },
      });
      updateServiceType(editingType.id, editingType.name.trim());
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service type?")) {
      setDeletingTypeId(id); // Set the deleting ID so we know which type is being deleted
      await deleteCareServiceType({ variables: { id } });
      removeServiceType(id);
    }
  };

  // Show loading state
  if (loading)
    return (
      <div className="flex flex-col justify-center items-center gap-3 min-h-[300px]">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
        Loading care service types...
      </div>
    );

  // Show error state
  if (error)
    return <div>Error loading care service types: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Create new service type */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Service Type</h2>
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="Enter service type name"
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className={`${
              createLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded`}
            disabled={createLoading}
          >
            {createLoading ? (
              <LoaderCircle className="animate-spin h-5 w-5 text-white" />
            ) : (
              "Add"
            )}
          </button>
        </form>
      </div>

      {/* List of existing service types */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Manage Service Types</h2>

        {careServiceTypes.length === 0 ? (
          <p>No service types found. Add one above.</p>
        ) : (
          <ul className="divide-y">
            {careServiceTypes.map((type) => (
              <li key={type.id} className="py-3">
                {editingType && editingType.id === type.id ? (
                  <form onSubmit={handleUpdate} className="flex gap-2">
                    <input
                      type="text"
                      value={editingType.name}
                      onChange={(e) =>
                        setEditingType({ ...editingType, name: e.target.value })
                      }
                      className="flex-1 p-2 border rounded"
                      required
                    />
                    <button
                      type="submit"
                      className={`${
                        updateLoading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      } text-white px-3 py-1 rounded`}
                      disabled={updateLoading}
                    >
                      {updateLoading ? (
                        <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                      ) : (
                        "Save"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingType(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>{type.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingType(type)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type.id)}
                        className={`${
                          deleteLoading && deletingTypeId !== type.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white px-3 py-1 rounded`}
                        disabled={deleteLoading && deletingTypeId !== type.id}
                      >
                        {deleteLoading && deletingTypeId === type.id ? (
                          <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                        ) : (
                          "Delete"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
