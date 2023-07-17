const uri = '/api/TodoItems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => {
            _displayItems(data);
            getItemCategories();
        })
        .catch(error => console.error('Unable to get items.', error));
}

function getItemCategories() {
    fetch('/api/ItemCategories') 
        .then(response => response.json())
        .then(data => {
            _displayItemCategories(data);
        })
        .catch(error => console.error('Unable to get item categories.', error));
}


function addItem() {

    const addNameTextbox = document.getElementById('add-name');

    const item = {
        isComplete: document.getElementById('add-isComplete').checked,
        name: addNameTextbox.value.trim(),
        categoryId: document.getElementById('add-category').value
    };

    const errorMessage = document.getElementById('add-error-message');


    if (item.name.length === 0) {
        errorMessage.textContent = 'You did not enter a name.';
        errorMessage.style.display = 'block';
        addNameTextbox.value = '';
        return
    }

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
        .catch(error => console.error('Unable to delete item.', error));
}


function displayEditForm(id) {
    const editNameTextbox = document.getElementById('edit-name');
    const errorMessage = document.getElementById('edit-error-message');
    editNameTextbox.value = '';
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    const item = todos.find(item => item.Id === id);
    document.getElementById('edit-name').value = item.Name;
    document.getElementById('edit-id').value = item.Id;
    document.getElementById('edit-isComplete').checked = item.IsComplete;
    const selectElement = document.getElementById('edit-category');
    const categoryId = item.CategoryId;
    for (let i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === categoryId.toString()) {
            selectElement.selectedIndex = i;
            break;
        }
    }
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const editNameTextbox = document.getElementById('edit-name');

    const item = {
        id: parseInt(itemId, 10),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: editNameTextbox.value.trim(),
        categoryId: document.getElementById('edit-category').value
    };

    const errorMessage = document.getElementById('edit-error-message');


    if (item.name.length === 0) {
        errorMessage.textContent = 'You did not enter a name.';
        errorMessage.style.display = 'block';
        editNameTextbox.value = '';
        return
    }


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
        })
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';
    const counterElement = document.getElementById('counter');
    counterElement.innerText = itemCount + ' ' + name;
}

function _displayItems(data) {
    console.log(data);
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.IsComplete;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'displayEditForm(' + item.Id + ')');

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', 'deleteItem(' + item.Id + ')');

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.Name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        let textNode2 = document.createTextNode(item.ItemCategory.Title);
        td3.appendChild(textNode2);

        let td4 = tr.insertCell(3);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(4);
        td5.appendChild(deleteButton);
    });

    todos = data;
}

function _displayItemCategories(data) {
    const selectElement = document.getElementById('edit-category');
    selectElement.innerHTML = '';
    const selectElementAdd = document.getElementById('add-category');
    selectElementAdd.innerHTML = '';

    data.forEach(category => {
        let option = document.createElement('option');
        option.value = category.Id;
        option.textContent = category.Title;
        selectElementAdd.appendChild(option);
        let option2 = document.createElement('option');
        option2.value = category.Id;
        option2.textContent = category.Title;
        selectElement.appendChild(option2);
    });
}
