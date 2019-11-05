const tools = require('../js/tools.js');
const modalRenderer = require('../js/modals');

function AddGroup()
{
    let groupName = document.querySelector('#group__name');
    let groupTutor = document.querySelector('#group__tutor');

    tools.AddGroup(groupName.value, groupTutor.value);

    groupTutor.value = '';
    groupName.value = '';
}

function DeleteGroup(id)
{
    tools.RemoveGroup(id);
    modalRenderer.RenderGroupsTable();
}

function AddMember()
{
    const modal = document.querySelector('.add-person')
    const inputs = modal.querySelectorAll('input');
    const select = modal.querySelector('select');

    tools.AddMember(select.value, inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].checked, inputs[5].checked, inputs[6].checked);
}

function DeleteMember(gId, mId)
{
    tools.RemoveMember(gId, mId);
    modalRenderer.RenderMembersTable();
}

function EditMember(id)
{
    modalRenderer.FillInEditForm(id);
}

function SaveChanges(id)
{
    const form = document.querySelector('#edit-person__form')
    const inputs = form.querySelectorAll('input');
    const select = form.querySelector('select');

    tools.EditMember(select.value, id, inputs[0].value, inputs[1].value, inputs[2].value, inputs[3].value, inputs[4].checked, inputs[5].checked, inputs[6].checked);
    modalRenderer.RenderMembersTable();
}