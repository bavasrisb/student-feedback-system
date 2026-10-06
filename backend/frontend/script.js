const API_URL = "https://student-feedback-system-4evk.onrender.com/api/feedback";
// READ - Get all feedback
async function loadFeedback() {
  try {
    const response = await fetch(API_URL);
    const feedbackList = await response.json();

    const container = document.getElementById("feedbackList");

    if (feedbackList.length === 0) {
      container.innerHTML = "<p>No feedback available.</p>";
      return;
    }

    container.innerHTML = feedbackList
      .map(
        (feedback) => `
        <div class="feedback-card">
          <h3>${feedback.studentName}</h3>
          <p><strong>Course:</strong> ${feedback.course}</p>
          <p><strong>Rating:</strong> ${feedback.rating}/5</p>
          <p><strong>Comments:</strong> ${feedback.comments}</p>

          <button class="edit-btn"
            onclick='editFeedback(${JSON.stringify(feedback)})'>
            Edit
          </button>

          <button class="delete-btn"
            onclick="deleteFeedback('${feedback._id}')">
            Delete
          </button>
        </div>
      `
      )
      .join("");
  } catch (error) {
    console.error(error);
    document.getElementById("feedbackList").innerHTML =
      "<p>Unable to connect to server.</p>";
  }
}


// CREATE / UPDATE
async function saveFeedback() {
  const id = document.getElementById("feedbackId").value;

  const studentName = document.getElementById("studentName").value.trim();
  const course = document.getElementById("course").value.trim();
  const rating = document.getElementById("rating").value;
  const comments = document.getElementById("comments").value.trim();

  if (!studentName || !course || !rating || !comments) {
    alert("Please fill all fields.");
    return;
  }

  const feedbackData = {
    studentName,
    course,
    rating: Number(rating),
    comments
  };

  try {
    let response;

    if (id) {
      // UPDATE
      response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(feedbackData)
      });
    } else {
      // CREATE
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(feedbackData)
      });
    }

    if (!response.ok) {
      throw new Error("Operation failed");
    }

    alert(id ? "Feedback updated!" : "Feedback added!");

    clearForm();
    loadFeedback();

  } catch (error) {
    console.error(error);
    alert("Server error. Make sure Node.js server is running.");
  }
}


// EDIT
function editFeedback(feedback) {
  document.getElementById("feedbackId").value = feedback._id;
  document.getElementById("studentName").value = feedback.studentName;
  document.getElementById("course").value = feedback.course;
  document.getElementById("rating").value = feedback.rating;
  document.getElementById("comments").value = feedback.comments;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// DELETE
async function deleteFeedback(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this feedback?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    alert("Feedback deleted!");

    loadFeedback();

  } catch (error) {
    console.error(error);
    alert("Unable to delete feedback.");
  }
}


// CLEAR FORM
function clearForm() {
  document.getElementById("feedbackId").value = "";
  document.getElementById("studentName").value = "";
  document.getElementById("course").value = "";
  document.getElementById("rating").value = "";
  document.getElementById("comments").value = "";
}


// Load data when page opens
loadFeedback();