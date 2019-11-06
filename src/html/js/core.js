const tools = require('../js/tools.js');            //require tools modure
const modalRenderer = require('../js/modals');      //require modalse renderer

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

    //TODO: clearing inputs
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
}