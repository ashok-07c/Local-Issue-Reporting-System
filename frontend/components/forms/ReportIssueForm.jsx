import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { issuesApi } from "../../src/lib/api.js";
import { AP_LOCATIONS, DISTRICTS } from "../../src/data/apLocations.js";

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
    district: "",
    mandal: "",
    location: "",
    title: "",
    description: "",
    photos: [],
    additionalInfo: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mandal options depend on the selected district — sorted for easy scanning.
  const mandalOptions = useMemo(
    () => (formData.district ? [...AP_LOCATIONS[formData.district]].sort() : []),
    [formData.district]
  );

  const handleDistrictChange = (e) => {
    // Changing district invalidates whatever mandal was previously picked.
    setFormData((prev) => ({ ...prev, district: e.target.value, mandal: "" }));
  };

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

  // Photos are kept as real File objects (needed to upload as multipart/form-data);
  // each also gets a local object URL just for the in-form preview thumbnail.
  const handleFileChange = (e) => {
    const MAX_FILE_SIZE_MB = 2; // matches the backend's multer limit (2MB/photo)
    const MAX_TOTAL_PHOTOS = 3;

    const files = Array.from(e.target.files);
    const validFiles = [];

    for (let file of files) {
      const fileSizeInMB = file.size / (1024 * 1024);

      if (fileSizeInMB > MAX_FILE_SIZE_MB) {
        alert(`"${file.name}" is too large! Please keep photos under 2MB.`);
        continue;
      }
      validFiles.push(file);
    }

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...validFiles].slice(0, MAX_TOTAL_PHOTOS),
    }));

    // Allow re-selecting the same file later
    e.target.value = "";
  };

  const handleRemovePhoto = (idx) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select an issue category before submitting!");
      return;
    }
    if (!formData.district || !formData.mandal) {
      alert("Please select the district and mandal before submitting!");
      return;
    }

    const selectedCategoryObj = categories.find(
      (cat) => cat.label === formData.category,
    );
    const assignedIconName = selectedCategoryObj
      ? selectedCategoryObj.iconName
      : "FaEllipsisH";

    const body = new FormData();
    body.append("title", formData.title);
    body.append("issue", formData.category);
    body.append("location", formData.location);
    body.append("district", formData.district);
    body.append("mandal", formData.mandal);
    body.append("description", formData.description);
    body.append("additionalInfo", formData.additionalInfo);
    body.append("icon", assignedIconName);
    formData.photos.forEach((file) => body.append("photos", file));

    setIsSubmitting(true);
    try {
      await issuesApi.create(body);
      alert("Complaint Submitted!");
      setFormData(initialData);
      navigate("/my-reports");
    } catch (err) {
      alert(err.message || "Failed to submit complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      {}
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

      {}
      <div className="form-section">
        <label>District</label>
        <select
          name="district"
          value={formData.district}
          onChange={handleDistrictChange}
          required
        >
          <option value="" disabled>
            Select district
          </option>
          {DISTRICTS.slice().sort().map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <label>Mandal</label>
        <select
          name="mandal"
          value={formData.mandal}
          onChange={handleChange}
          disabled={!formData.district}
          required
        >
          <option value="" disabled>
            {formData.district ? "Select mandal" : "Select district first"}
          </option>
          {mandalOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {}
      <div className="form-section">
        <label>Issue Location</label>
        <div className="location-field">
          <FaMapMarkerAlt className="icon" />
          <input
            type="text"
            name="location"
            placeholder="Street / landmark / area (e.g. near bus stop, MG Road)"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {}
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

      {}
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
          {formData.photos.map((file, idx) => (
            <div key={idx} className="photo-item">
              <img src={URL.createObjectURL(file)} alt="preview" />
              <FaTimes
                className="remove-icon"
                onClick={() => handleRemovePhoto(idx)} 
              />
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="form-section">
        <label>Additional Information (Optional)</label>
        <textarea
          name="additionalInfo"
          placeholder="Any extra details"
          value={formData.additionalInfo}
          onChange={handleChange}
        />
      </div>

      {}
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={handleCancel}>
          <FaTimes /> Cancel
        </button>
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          <FaPaperPlane /> {isSubmitting ? "Submitting…" : "Submit Report"}
        </button>
      </div>
    </form>
  );
}
