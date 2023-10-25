const users = [];
const userTableBody = document.getElementById('user-table-body');
const appIDInput = document.getElementById('appID');
const appSecretInput = document.getElementById('appSecret');
const statusMessage = document.getElementById('status');
let selectedRowIndex = -1; // Track the selected row index

// Function to open the delete user modal
function openDeleteUserModal(id) {
    // Display the delete user modal
    const deleteUserModal = document.getElementById('deleteUserModal');
    deleteUserModal.style.display = 'block';

    // Pass the user's ID to the modal for later use
    deleteUserModal.dataset.userId = id;
}

// Function to close the delete user modal
function closeDeleteUserModal() {
    const deleteUserModal = document.getElementById('deleteUserModal');
    deleteUserModal.style.display = 'none';
    // Clear any user data from the modal
    deleteUserModal.removeAttribute('data-user-id');
}

// Function to handle user deletion
function confirmDeleteUser() {
    const deleteUserModal = document.getElementById('deleteUserModal');
    const userId = deleteUserModal.dataset.userId;

    // Find the user by ID and delete them
    const userIndex = users.findIndex(user => user.id === parseInt(userId, 10));
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        renderUserTable();
        statusMessage.textContent = 'User deleted successfully.';
    }

    // Close the modal
    closeDeleteUserModal();
}

function showNotification(text, event) {
    const notificationModal = document.querySelector('.notification-modal');
    const notificationText = notificationModal.querySelector('#notification-text');
    notificationText.textContent = text;
    notificationModal.style.display = 'block';

    // Position the modal above the clicked button
    const iconButtonRect = event.target.getBoundingClientRect();
    notificationModal.style.top = (iconButtonRect.top - notificationModal.offsetHeight) + 'px';
    notificationModal.style.left = iconButtonRect.left + 'px';
}

function closeNotification() {
    const notificationModal = document.querySelector('.notification-modal');
    notificationModal.style.display = 'none';
    document.querySelector('#notification-text').textContent = '';
}

function copyTextToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    statusMessage.textContent = 'URL copied to clipboard.';
}

function renderRow(user, index) {
    const row = document.createElement('tr');
    const url = `https://instance.fique.online/webhook/merge/d16f355e-cc56-4a36-9042-b13c50aaf83a/data/cbcc097ce10dfcf76cc5958a26993c3143f2680a283e4a1f4100744e70cd4be083dcf1dfb2?user=${user.id}`;
    const truncatedUrl = url.length > 50 ? `${url.slice(0, 30)}...` : url;

    row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.appID}</td>
        <td>${user.appSecret}</td>
        <td>
            <div class="url-container">
                <button class="read-more-btn"><i class="far fa-eye eye-icon"></i></button>
                <span class="full-url" style="display: none;">${url}</span>
                <span class="truncated-url">${truncatedUrl}</span>
                <button class="copy-button"><i class="far fa-copy copy-icon"></i></button>
            </div>
        </td>
        <td class="button-cell">
            <button class="edit-button">Edit</button>
            <button class="delete-button" style="display: none;">Delete</button>
            <button class="update-button" style="display: none;">Update</button>
        </td>
    `;

    const copyButton = row.querySelector('.copy-button');
    const readMoreBtn = row.querySelector('.read-more-btn');
    const editButton = row.querySelector('.edit-button');
    const deleteButton = row.querySelector('.delete-button');
    const updateButton = row.querySelector('.update-button');

    readMoreBtn.addEventListener('click', (event) => {
        const notificationModal = document.querySelector('.notification-modal');
        if (notificationModal.style.display === 'block') {
            closeNotification();
            readMoreBtn.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            showNotification(url, event);
            readMoreBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    });
    copyButton.addEventListener('click', () => {
        copyTextToClipboard(url);
    });

    editButton.addEventListener('click', () => {
        editUser(index);
    });

    // Only add the deleteButton event listener if the delete button exists
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            // Get the user ID associated with this row
            const userId = row.querySelector('td:first-child').textContent;
            openDeleteUserModal(userId);
        });
    }

    updateButton.addEventListener('click', () => {
        updateUser(index);
    });

    return row;
}

function renderUserTable() {
    userTableBody.innerHTML = '';
    users.forEach((user, index) => {
        const row = renderRow(user, index);
        userTableBody.appendChild(row);
    });
}

function addUser() {
    const appID = appIDInput.value.trim();
    const appSecret = appSecretInput.value.trim();

    if (appID === '' || appSecret === '') {
        // Display an error message and turn the input fields red
        statusMessage.textContent = 'Please fill in both App ID and App Secret.';
        appIDInput.style.borderColor = 'red';
        appSecretInput.style.borderColor = 'red';
        return; // Exit the function without adding the user
    }

    // If the fields are filled, clear the error message and red borders
    appIDInput.style.borderColor = '';
    appSecretInput.style.borderColor = '';
    statusMessage.textContent = '';

    // Add the user to the list and update the table
    const newUser = {
        id: Date.now(),
        appID: appID,
        appSecret: appSecret
    };
    users.push(newUser);
    renderUserTable();
    clearFormInputs();
    statusMessage.textContent = 'User added successfully.';
}

function editUser(index) {
    if (selectedRowIndex === index) {
        // If the clicked row is already selected, hide the edit buttons
        hideEditButtons(index);
        selectedRowIndex = -1;
    } else {
        // If a different row is clicked, hide the edit buttons for the previously selected row
        if (selectedRowIndex !== -1) {
            hideEditButtons(selectedRowIndex);
        }

        // Show the edit buttons for the newly selected row
        showEditButtons(index);
        selectedRowIndex = index;
    }
}

function deleteUser(id) {
    const userIndex = users.findIndex(user => user.id === parseInt(id, 10));
    if (userIndex !== -1) {
        // Display a confirmation dialog
        const confirmed = confirm('Are you sure you want to delete this user?');
        if (confirmed) {
            users.splice(userIndex, 1);
            renderUserTable();
            statusMessage.textContent = 'User deleted successfully.';
            console.log(users);
            const requestBody = {
                users: users, // Assuming 'users' is an array of user objects
              };
              
              const request = new Request('https://instance.fique.online/webhook/merge/d16f355e-cc56-4a36-9042-b13c50aaf83a/delete/f3f7e2feb834ba5e64994ac592074c6cae63732b6b192719ef4f1efaa1a74d0e5e3afabf49', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json', // Specify the content type
                },
                body: JSON.stringify(requestBody), // Convert the data to a JSON string
              });
// Make the POST request
fetch(request)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Data received:', data);
    // Handle the response data here
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
        } else {
            statusMessage.textContent = 'User deletion canceled.';
        }
    }
}

function updateUser(index) {
    const userToEdit = users[index];
    userToEdit.appID = appIDInput.value;
    userToEdit.appSecret = appSecretInput.value;
    clearFormInputs();
    hideEditButtons(index);
    renderUserTable();
    statusMessage.textContent = 'User updated successfully.';
}

function clearFormInputs() {
    appIDInput.value = '';
    appSecretInput.value = '';
    appIDInput.style.borderColor = ''; // Reset the border color
    appSecretInput.style.borderColor = ''; // Reset the border color
    document.getElementById('add-user-button').onclick = addUser;
}

function showEditButtons(index) {
    const row = document.querySelector(`#user-table-body tr:nth-child(${index + 1})`);
    const deleteButton = row.querySelector('.delete-button');
    const updateButton = row.querySelector('.update-button');
    deleteButton.style.display = 'inline';
    updateButton.style.display = 'inline';
}

function hideEditButtons(index) {
    const row = document.querySelector(`#user-table-body tr:nth-child(${index + 1})`);
    if (row) {
        const deleteButton = row.querySelector('.delete-button');
        const updateButton = row.querySelector('.update-button');
        if (deleteButton) {
            deleteButton.style.display = 'none';
        }
        if (updateButton) {
            updateButton.style.display = 'none';
        }
    }
}

// Event listeners
document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', (event) => {
        // Get the user ID associated with this row
        const userId = event.target.closest('tr').querySelector('td:first-child').textContent;
        openDeleteUserModal(userId);
    });
});

document.getElementById('confirmDelete').addEventListener('click', confirmDeleteUser);
document.getElementById('cancelDelete').addEventListener('click', closeDeleteUserModal);

// Close the modal if the user clicks anywhere outside it
window.addEventListener('click', (event) => {
    const deleteUserModal = document.getElementById('deleteUserModal');
    if (event.target === deleteUserModal) {
        closeDeleteUserModal();
    }
});

document.getElementById('add-user-button').onclick = addUser;
