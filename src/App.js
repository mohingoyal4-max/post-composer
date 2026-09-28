import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { saveDraftMock } from "./mockApi";

import "./App.css";

// Platform character limits
const platformLimits = {
  Twitter: 280,
  Instagram: 2200,
  LinkedIn: 3000,
};

// Strategy Pattern: validation strategies
const validationStrategies = {
  Twitter: (content) => {
    if (content.length > 280) {
      return "Twitter posts cannot exceed 280 characters.";
    }

    return "";
  },

  Instagram: (content) => {
    if (content.length > 2200) {
      return "Instagram posts cannot exceed 2200 characters.";
    }

    return "";
  },

  LinkedIn: (content) => {
    if (content.length > 3000) {
      return "LinkedIn posts cannot exceed 3000 characters.";
    }

    return "";
  },
};

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [content, setContent] = useState("");

  const [drafts, setDrafts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // Load drafts from localStorage
  useEffect(() => {
    const savedDrafts =
      JSON.parse(localStorage.getItem("drafts")) || [];

    setDrafts(savedDrafts);
  }, []);

  // Current platform limit
  const currentLimit = platformLimits[platform];

  // Real-time validation
  const validationError =
    validationStrategies[platform](content);

  // Character count
  const characterCount = content.length;

  // Save drafts to localStorage
  const updateLocalStorage = (updatedDrafts) => {
    setDrafts(updatedDrafts);

    localStorage.setItem(
      "drafts",
      JSON.stringify(updatedDrafts)
    );
  };

  // Mock API with retry
  const saveWithRetry = async (
    draft,
    retries = 3
  ) => {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await saveDraftMock(draft);
      } catch (err) {
        lastError = err;

        if (attempt < retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, 500)
          );
        }
      }
    }

    throw lastError;
  };

  // Save or update draft
  const handleSaveDraft = async () => {
    setError("");
    setSuccess("");

    if (content.trim() === "") {
      setError("Please enter some content before saving.");
      toast.error("Please enter some content.");
      return;
    }

    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);

    const draft = {
      id: editingId || Date.now(),
      platform,
      content,
      createdAt: new Date().toLocaleString(),
    };

    try {
      await saveWithRetry(draft, 3);

      let updatedDrafts;

      if (editingId) {
        updatedDrafts = drafts.map((item) =>
          item.id === editingId
            ? draft
            : item
        );

        setSuccess("Draft updated successfully!");
        toast.success("Draft updated successfully!");
      } else {
        updatedDrafts = [...drafts, draft];

        setSuccess("Draft saved successfully!");
        toast.success("Draft saved successfully!");
      }

      updateLocalStorage(updatedDrafts);

      setContent("");
      setEditingId(null);
    } catch (err) {
      setError(
        "Unable to save draft after multiple attempts."
      );

      toast.error(
        "Unable to save draft. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit draft
  const handleEdit = (draft) => {
    setPlatform(draft.platform);
    setContent(draft.content);
    setEditingId(draft.id);

    setError("");
    setSuccess("");

    toast.info("Draft loaded for editing.");
  };

  // Delete draft
  const handleDelete = (id) => {
    const updatedDrafts = drafts.filter(
      (draft) => draft.id !== id
    );

    updateLocalStorage(updatedDrafts);

    toast.success("Draft deleted successfully.");

    if (editingId === id) {
      setContent("");
      setEditingId(null);
    }
  };

  // Publish post
  const handlePublish = () => {
    if (content.trim() === "") {
      toast.error("Please enter some content.");
      return;
    }

    if (validationError) {
      toast.error(validationError);
      return;
    }

    toast.success(
      `Post published successfully on ${platform}!`
    );

    setContent("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // Clear composer
  const handleClear = () => {
    setContent("");
    setEditingId(null);
    setError("");
    setSuccess("");

    toast.info("Composer cleared.");
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-text">
  <span className="badge">
              SOCIAL MEDIA TOOL
            </span>

            <h1>Post Composer</h1>

            <p>
              Create, validate, save and publish
              content across platforms.
            </p>
          </div>

          <div className="header-icon">
            ✦
          </div>
        </div>
      </header>

      <main className="container">

        {/* Composer Card */}
        <section className="card composer-card">

          <div className="section-heading">
            <div>
              <span className="section-label">
                CREATE
              </span>

              <h2>Compose your post</h2>

              <p>
                Select a platform and start writing.
              </p>
            </div>

            <div className="status-dot">
              ● Live
            </div>
          </div>

          {/* Platform Selection */}
          <div className="platform-section">

            <label>
              Select Platform
            </label>

            <div className="platform-grid">

              <button
                type="button"
                className={`platform-card ${
                  platform === "Twitter"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPlatform("Twitter")
                }
              >
                <span className="platform-logo">
                  𝕏
                </span>

                <span>
                  <strong>Twitter</strong>
                  <small>280 characters</small>
                </span>
              </button>

              <button
                type="button"
                className={`platform-card ${
                  platform === "Instagram"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPlatform("Instagram")
                }
              >
                <span className="platform-logo">
                  ◎
                </span>

                <span>
                  <strong>Instagram</strong>
                  <small>2200 characters</small>
                </span>
              </button>

              <button
                type="button"
                className={`platform-card ${
                  platform === "LinkedIn"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPlatform("LinkedIn")
                }
              >
                <span className="platform-logo">
                  in
                </span>

                <span>
                  <strong>LinkedIn</strong>
                  <small>3000 characters</small>
                </span>
              </button>

            </div>
          </div>

          {/* Text Area */}
          <div className="composer-area">

            <div className="textarea-header">
              <label>
                Your Content
              </label>

              <span className="selected-platform">
                {platform}
              </span>
            </div>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="What would you like to share today?"
              maxLength={currentLimit}
            />

            <div className="composer-footer">

              <span
                className={
                  characterCount > currentLimit * 0.9
                    ? "counter warning"
                    : "counter"
                }
              >
                {characterCount} / {currentLimit}
              </span>

              <span className="platform-hint">
                {platform} limit
              </span>

            </div>
          </div>

          {/* Validation */}
          {validationError && (
            <div className="message error-message">
              <span>⚠</span>
              {validationError}
            </div>
          )}

          {success && (
            <div className="message success-message">
              <span>✓</span>
              {success}
            </div>
          )}

          {error && (
            <div className="message error-message">
              <span>⚠</span>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="actions">

            <button
              className="secondary-button"
              onClick={handleClear}
            >
              Clear
            </button>

            <button
              className="save-button"
              onClick={handleSaveDraft}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Draft"
                : "Save Draft"}
            </button>

            <button
              className="publish-button"
              onClick={handlePublish}
              disabled={
                !content.trim() ||
                !!validationError ||
                loading
              }
            >
              🚀 Publish
            </button>

          </div>

        </section>

        {/* Drafts */}
        <section className="card drafts-card">

          <div className="section-heading">

            <div>
              <span className="section-label">
                STORAGE
              </span>

              <h2>Saved Drafts</h2>

              <p>
                Your drafts are stored locally in your browser.
              </p>
            </div>

            <div className="draft-count">
              {drafts.length}
            </div>

          </div>

          {drafts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                ✎
              </div>

              <h3>No drafts yet</h3>

              <p>
                Your saved posts will appear here.
              </p>
            </div>
          ) : (
            <div className="draft-list">

              {drafts.map((draft) => (
                <div
                  className="draft-item"
                  key={draft.id}
                >

                  <div className="draft-content">

                    <div className="draft-top">

                      <span className="draft-platform">
                        {draft.platform}
                      </span>

                      <span className="draft-date">
                        {draft.createdAt}
                      </span>

                    </div>

                    <p>
                      {draft.content}
                    </p>

                  </div>

                  <div className="draft-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        handleEdit(draft)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        handleDelete(draft.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* Feature Information */}
        <section className="feature-grid">

          <div className="feature">
            <span>✓</span>
            <div>
              <strong>Real-time Validation</strong>
              <p>
                Platform-specific limits are checked instantly.
              </p>
            </div>
          </div>

          <div className="feature">
            <span>⌁</span>
            <div>
              <strong>Local Draft Storage</strong>
              <p>
                Drafts remain available using localStorage.
              </p>
            </div>
          </div>

          <div className="feature">
            <span>↻</span>
            <div>
              <strong>Reliable Saving</strong>
              <p>
                Mock API retry logic handles failed requests.
              </p>
            </div>
          </div>

        </section>

      </main>

      <footer>
        Developed by <a href="https://github.com" target="_blank" rel="noopener noreferrer">
        Mohin goyal
        </a>
      </footer>

      <ToastContainer
        position="top-right"
        autoClose={2500}
      />

    </div>
  );
}

export default App;