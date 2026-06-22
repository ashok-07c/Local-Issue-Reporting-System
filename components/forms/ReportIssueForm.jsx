import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaRoad,
  FaLightbulb,
  FaTint,
  FaTrash,
  FaWater,
  FaTree,
  FaBuilding,
  FaEllipsisH,
  FaMapMarkerAlt,
  FaUpload,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";

export default function ReportForm() {
  const navigate = useNavigate();

  const initialData = {
    category: "",
    location: "",
    title: "",
    description: "",
    photos: [],
    additionalInfo: "",
  };

  const [formData, setFormData] = useState(initialData);

  const categories = [
    { label: "Roads & Potholes", icon: <FaRoad />, iconName: "FaRoad" },
    { label: "Street Light", icon: <FaLightbulb />, iconName: "FaLightbulb" },
    { label: "Water Supply", icon: <FaTint />, iconName: "FaTint" },
    { label: "Garbage & Waste", icon: <FaTrash />, iconName: "FaTrash" },
    { label: "Drainage", icon: <FaWater />, iconName: "FaWater" },
    { label: "Parks & Gardens", icon: <FaTree />, iconName: "FaTree" },
    {
      label: "Building & Structure",
      icon: <FaBuilding />,
      iconName: "FaBuilding",
    },
    { label: "Other", icon: <FaEllipsisH />, iconName: "FaEllipsisH" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const MAX_FILE_SIZE_MB = 0.5; 
    const MAX_TOTAL_PHOTOS = 3; 

    const files = Array.from(e.target.files);
    const validFiles = [];

    for (let file of files) {
      const fileSizeInMB = file.size / (1024 * 1024);

      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        alert(`"${file.name}" is too large! Please compress it under 500KB.`);
        continue; // Skip this file
      }
      validFiles.push(file);
    }

    const finalSelection = [...formData.photos, ...validFiles].slice(
      0,
      MAX_TOTAL_PHOTOS,
    );

    const base64Promises = validFiles
      .slice(0, MAX_TOTAL_PHOTOS - formData.photos.length)
      .map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

    const base64Images = await Promise.all(base64Promises);

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...base64Images].slice(0, MAX_TOTAL_PHOTOS),
    }));
  };

  // Fixed: Cleaned up photo extraction function
  const handleRemovePhoto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form Validation Check
    if (!formData.category) {
      alert("Please select an issue category before submitting!");
      return;
    }

    const complaintsData = localStorage.getItem("complaints");
    const complaints = complaintsData ? JSON.parse(complaintsData) : [];

    const sessionData = localStorage.getItem("currentSession");
    const currentUser = sessionData ? JSON.parse(sessionData) : null;
    const userName = currentUser?.fullName || "Anonymous User";

    const selectedCategoryObj = categories.find(
      (cat) => cat.label === formData.category,
    );
    const assignedIconName = selectedCategoryObj
      ? selectedCategoryObj.iconName
      : "FaEllipsisH";

    const complaint = {
      id: Date.now(),
      user: userName,
      title: formData.title, 
      issue: formData.category,
      location: formData.location,
      description: formData.description,
      additionalInfo: formData.additionalInfo, 
      status: "Pending",
      date: new Date().toLocaleString(),
      photos: formData.photos || [],
      icon: assignedIconName,
    };

    complaints.push(complaint);
    localStorage.setItem("complaints", JSON.stringify(complaints));

    alert("Complaint Submitted!");
    setFormData(initialData); // Reset form state values cleanly
    navigate("/my-reports");
  };

  const handleCancel = () => {
    setFormData(initialData);
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      {/* Category Section */}
      <div className="form-section">
        <label>Issue Category</label>
        <div className="category-options">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.label}
              className={`category-btn ${
                formData.category === cat.label ? "active" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, category: cat.label }))
              }
            >
              <span className="icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location Section */}
      <div className="form-section">
        <label>Issue Location</label>
        <div className="location-field">
          <FaMapMarkerAlt className="icon" />
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Text Details Section */}
      <div className="form-section">
        <label>Title</label>
        <input
          type="text"
          name="title"
          placeholder="Short title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Describe the issue"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Media Upload Section */}
      <div className="form-section">
        <label>Add Photos (Max 3 photos)</label>
        <div className="upload-box">
          <FaUpload className="icon" />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="photo-preview">
          {formData.photos.map((base64String, idx) => (
            <div key={idx} className="photo-item">
              <img src={base64String} alt="preview" />
              <FaTimes
                className="remove-icon"
                onClick={() => handleRemovePhoto(idx)} /* Fixed reference */
              />
            </div>
          ))}
        </div>
      </div>

      {/* Optional Info Section */}
      <div className="form-section">
        <label>Additional Information (Optional)</label>
        <textarea
          name="additionalInfo"
          placeholder="Any extra details"
          value={formData.additionalInfo}
          onChange={handleChange}
        />
      </div>

      {/* Form Action Controls */}
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          <FaTimes /> Cancel
        </button>
        <button type="submit" className="submit-btn">
          <FaPaperPlane /> Submit Report
        </button>
      </div>
    </form>
  );
}
