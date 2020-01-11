const tools = require('../js/tools.js');            //require tools modure
const modalRenderer = require('../js/modals');      //require modalse renderer

let groupSelect;
let monthSelect;
let yearSelect;

window.onload = () => {
    const options = document.querySelector('.options');
    const selects = options.querySelectorAll('select');
    groupSelect = selects[0];
    monthSelect = selects[1];
    yearSelect = selects[2];
}

/**
 * This function displys alert.
 * @param {string} text - text to display.
 */
function DisplayAlert(text)
{
    const modal = document.querySelector('.modal--visible');
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.innerHTML = text;

    modal.appendChild(alert);

    setTimeout(() => {
        modal.removeChild(alert);
    }, 750)
}

/**
 * @description This function gets data from inputs in add group window
 * and adding new group to database
 */
function AddGroup()
{
    let groupName = document.querySelector('#group__name');     //group name input field
    let groupTutor = document.querySelector('#group__tutor');   //group tutor input field

    //adding data to database
    tools.AddGroup(groupName.value, groupTutor.value);

    //clearing inputs
    groupTutor.value = '';
    groupName.value = '';

    tableRenderer.RenderGroupSelect(groupSelect);

    DisplayAlert('Pomyślnie dodano grupę!');
}

/**
 * @description This function deletes group from database
 * @param {int} id - group id
 */
function DeleteGroup(id)
{
    //removing group from database
    tools.RemoveGroup(id);

    //refreshing groups table
    modalRenderer.RenderGroupsTable();

    //currently showing group
    const currentGroup = groupSelect.value;

    //refreshing main table
    tableRenderer.RenderGroupSelect(groupSelect);

    //checking if table should be refreshed
    if(id == currentGroup)
        tableRenderer.RenderTable(groupSelect.value, monthSelect.value, yearSelect.value);

    DisplayAlert('Pomyślnie usunięto grupę!');
}

/**
 * @description This function gets data from input in add member window
 * and adding new member to database
 */
function AddMember()
{
    const modal = document.querySelector('.add-person');    //add member from parent
    const inputs = modal.querySelectorAll('input');         //array of inputs from add member form
    const select = modal.querySelector('select');           //group select from add member form

    //adding member to database
    tools.AddMember(select.value, inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].checked, inputs[5].checked, inputs[6].checked);

    //clearing inputs
    inputs.forEach(input => {
        if(input.type == 'checkbox')
            input.checked = false;
        else
            input.value = '';
    });

    tableRenderer.RenderTable(groupSelect.value, monthSelect.value, yearSelect.value);

    DisplayAlert('Pomyślnie dodano osobę!');
}

/**
 * @description This function deletes member from database
 * @param {int} gId 
 * @param {int} mId 
 */
function DeleteMember(gId, mId)
{
    //removing member from database
    tools.RemoveMember(gId, mId);

    //refreshing members table
    modalRenderer.RenderMembersTable();

    tableRenderer.RenderTable(groupSelect.value, monthSelect.value, yearSelect.value);

    DisplayAlert('Pomyślnie usunięto osobę!');
}

/**
 * @description This function shows edit member form
 * @param {int} id - person to edit id 
 */
function EditMember(id)
{
    //displaying and filling in edit member form
    modalRenderer.FillInEditForm(id);
}

/**
 * @description This function saving changes to member
 * @param {int} id - person to edit id
 */
function SaveChanges(id)
{
    const form = document.querySelector('#edit-person__form');      //edit person form
    const inputs = form.querySelectorAll('input');                  //array of inputs in edit person form
    const select = form.querySelector('select');                    //group select in edit person form

    //saving person changes 
    tools.EditMember(select.value, id, inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].checked, inputs[5].checked, inputs[6].checked);

    //refreshing members table
    modalRenderer.RenderMembersTable();

    //refreshing table
    tableRenderer.RenderTable(groupSelect.value, monthSelect.value, yearSelect.value);

    DisplayAlert('Pomyślnie edytowano osobę!');
}

function SaveChangesInGroupMembers()
{
    const table = document.querySelector('#group-members__table');
    const inputs = table.querySelectorAll('input[type=radio]');

    inputs.forEach(input => {
        if(input.checked)
        {
            const groupId = input.getAttribute('groupid');
            const memberId = input.getAttribute('name');

            tools.ChangeGroup(memberId, groupId);
        }
    });

    modalRenderer.RenderManageGroupMembers();

    //refreshing table
    tableRenderer.RenderTable(groupSelect.value, monthSelect.value, yearSelect.value);
}

/**
 * @description Used for filtering members table
 * @param {String} tableId - id of table to search
 * @param {String} searchFieldId - search field id
 */
function Search(tableId, searchFieldId)
{
    const searchField = document.querySelector(`#${searchFieldId}`);        //search field node
    const table = document.querySelector(`#${tableId}`);
    const rows = table.querySelectorAll('tr');
    const string = searchField.value;                                       //string to search (from search field)

    for(let i = 1; i < rows.length; i++)
    {  
        /** 
         * Looping through all rows (except first because it is table header 
         * and we don't want to search sth in header) in table, 
         * getting all his cells and looping through all cells if string isn't empty.
         * If it is, function shows all rows ang goes to next iteration
         **/ 
        if(string == '')
        {
            rows[i].style.display = 'table-row';
            continue;
        }
    
        const cells = rows[i].querySelectorAll('td');

        for(let j = 1; j < cells.length; j++)
        {
            /**
             * Looping through all cells in row (except 1st - it's ID and 5th - buttons),
             * checking if row includes string from search field and showing this rows,
             * if row doesn't include string, function hides him 
             */

            if(j == 5)
                continue;

            let cellValue = cells[j].innerText.toLowerCase();

            if(cellValue.includes(string.toLowerCase()))
            {
                rows[i].style.display = 'table-row';
                break;
            }
            else
            {
                rows[i].style.display = 'none';
            }
        }
}
}