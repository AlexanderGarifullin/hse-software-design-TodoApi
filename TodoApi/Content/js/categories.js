const uri = '/api/ItemCategories';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => {
            _displayItems(data);
        })
        .catch(error => console.error('Unable to get categories.', error));
}

function checkUniqueTitle(title) {
    return fetch(uri + `?title=${encodeURIComponent(title)}`)
        .then(response => response.json())
        .then(data => {
            return data.length === 0;
        })
        .catch(error => console.error('Unable to check title uniqueness.', error));
}

function checkUniqueTitleEdit(id, title) {
    return fetch(`${uri}?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}`)
      .then(response => response.json())
        .then(data => {
            console.log('data',data);
            return data.length === 0;
        })
        .catch(error => console.error('Unable to check title uniqueness.', error));
}




function addItem() {
    const addNameTextbox = document.getElementById('add-name');
    const errorMessage = document.getElementById('add-error-message');

    const title = addNameTextbox.value.trim();

    if (title.length === 0) {
        errorMessage.textContent = 'You did not enter a title.';
        errorMessage.style.display = 'block';
        addNameTextbox.value = '';
        return
    }


    checkUniqueTitle(title)
        .then(isUnique => {
            if (isUnique) {
                const item = {
                    title: title
                };

                fetch(uri, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                })
                    .then(response => response.json())
                    .then(() => {
                        getItems();
                        addNameTextbox.value = '';
                        errorMessage.textContent = '';
                        errorMessage.style.display = 'none';
                    })
                    .catch(error => console.error('Unable to add item.', error));
            } else {
                errorMessage.textContent = 'Category with the same title already exists.';
                errorMessage.style.display = 'block';
                addNameTextbox.value = '';
            }
        })
        .catch(error => console.error('Unable to check title uniqueness.', error));
}


function deleteItem(id) {
    fetch(uri + '/' + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete category.', error));
}

function displayEditForm(id) {
    const editNameTextbox = document.getElementById('edit-name');
    const errorMessage = document.getElementById('edit-error-message');
    editNameTextbox.value = '';
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    const item = todos.find(item => item.Id === id);
    document.getElementById('edit-name').value = item.Title;
    document.getElementById('edit-id').value = item.Id;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {

    const editNameTextbox = document.getElementById('edit-name');
    const errorMessage = document.getElementById('edit-error-message');

    if (document.getElementById('edit-name').value.trim().length === 0) {
        errorMessage.textContent = 'You did not enter a title.';
        errorMessage.style.display = 'block';
        editNameTextbox.value = '';
        return;
    }


    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        title: document.getElementById('edit-name').value.trim()
    };

    checkUniqueTitleEdit(item.id, item.title)
        .then(isUnique => {
            if (isUnique) {
                fetch(uri + '/' + itemId, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                })
                    .then(() => {
                        getItems();
                        editNameTextbox.value = '';
                        errorMessage.textContent = '';
                        errorMessage.style.display = 'none';
                        closeInput();
                    })
                    .catch(error => console.error('Unable to update category.', error));

            } else {
                errorMessage.textContent = 'Category with the same title already exists.';
                errorMessage.style.display = 'block';
                editNameTextbox.value = '';
            }
        })
        .catch(error => console.error('Unable to check title uniqueness.', error));

   return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'category' : 'categories';
    const counterElement = document.getElementById('counter');
    counterElement.innerText = itemCount + ' ' + name;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {


        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'displayEditForm(' + item.Id + ')');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteItem(' + item.Id + ')');

        let tr = tBody.insertRow();

        let td2 = tr.insertCell(0);
        let textNode = document.createTextNode(item.Title);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(1);
        td3.appendChild(editButton);

        let td4 = tr.insertCell(2);
        td4.appendChild(deleteButton);
    });

    todos = data;
}
