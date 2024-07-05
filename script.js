// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default anchor behavior
  
  // Perform logout actions here (e.g., redirect to logout page or clear session)
  console.log('Logging out...'); // Placeholder action
});

// Mode switch functionality
document.getElementById('modeSwitchBtn').addEventListener('click', function(event) {
  event.preventDefault(); // Prevent default anchor behavior
  
  // Toggle light/dark mode
  toggleDarkMode();
});

// Function to toggle dark mode
function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode'); // Toggle dark mode class
  
  // Save preference to localStorage or cookie if needed
}


// Array to store uploaded materials (for demonstration)
let uploadedMaterials = [
    { class: "Class 1", section: "Section A", year: "2023", fileName: "SampleMaterial1.pdf" },
    { class: "Class 2", section: "Section B", year: "2024", fileName: "SampleMaterial2.pdf" }
  ];
  
  // Function to display uploaded materials
  function displayUploadedMaterials() {
    let materialsList = document.getElementById('materialsList');
    materialsList.innerHTML = ''; 
    
    uploadedMaterials.forEach(function(material) {
      let materialItem = document.createElement('div');
      materialItem.classList.add('material-item');
      let link = document.createElement('a');
      link.href = `path-to-uploads/${material.fileName}`; 
      link.target = '_blank';
      link.textContent = `${material.class} - ${material.section} (${material.year}): ${material.fileName}`;
      materialItem.appendChild(link);
      materialsList.appendChild(materialItem);
    });
  }
  
  // Function to update total count of uploaded materials
  function updateTotalCount() {
    document.getElementById('totalCount').textContent = uploadedMaterials.length;
  }
  
  // Function to handle form submission for uploading materials
  document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    let classValue = document.getElementById('classSelect').value;
    let sectionValue = document.getElementById('sectionSelect').value;
    let yearValue = document.getElementById('yearSelect').value;
    let file = document.getElementById('fileUpload').files[0];
    
    // Simulate file upload - add your actual file upload logic here
    let newMaterial = {
      class: classValue,
      section: sectionValue,
      year: yearValue,
      fileName: file.name 
    };
    
    // Add new material to the array
    uploadedMaterials.push(newMaterial);
    
    // Display uploaded materials
    displayUploadedMaterials();
    
    // Update total count
    updateTotalCount();
    
    // Clear the form after upload
    document.getElementById('uploadForm').reset();
  });
  
  // Function to handle search input
  document.getElementById('searchButton').addEventListener('click', function() {
    let searchValue = document.getElementById('searchInput').value.toLowerCase();
    filterMaterials(searchValue);
  });
  
  // Function to filter materials based on search input
  function filterMaterials(searchValue) {
    let materialsList = document.getElementById('materialsList');
    let materialItems = materialsList.getElementsByClassName('material-item');
  
    Array.from(materialItems).forEach(function(item) {
      let textContent = item.textContent.toLowerCase();
      if (textContent.includes(searchValue)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  // Initial display of uploaded materials and total count
  displayUploadedMaterials();
  updateTotalCount();
  