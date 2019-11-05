const tools = require('../js/tools');

const GetGroupId = (id, groups) => {
    let gId = 0;

    groups.forEach(group => {
        if(group.members.includes(id))
            gId = group.id;
    });

    return gId;
};

const GetGroup = (id, groups) => {
    let gId = GetGroupId(id, groups);

    return tools.GetElementOfArrayById(gId, groups);
};

const RenderGroupsTable = () => {
    const groups = tools.LoadData().groups;
    let tbody = document.querySelector('#groups__table__body');
    const table = document.querySelector('#groups__table');

    console.log(groups);

    tbody.remove();
    tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'groups__table__body');
    table.appendChild(tbody);

    groups.forEach(group => {
        let tr = document.createElement('tr');
        tbody.appendChild(tr);

        let tds = [];

        for(let i = 0; i <= 3; i++)
        {
            let td = document.createElement('td');
            tr.appendChild(td);
            tds[i] = td;
        }

        let btn = document.createElement('button');
        btn.innerHTML = "Usuń";
        btn.setAttribute('onclick', 'DeleteGroup(' + group['id'] + ');');

        tds[0].innerHTML = group['id'];
        tds[1].innerHTML = group['name'];
        tds[2].innerHTML = group['tutor'];
        tds[3].appendChild(btn);
    });
};

const RenderMembersTable = () => {
    const json = tools.LoadData();
    const members = json.members;
    const groups = json.groups;
    const tableContainer = document.querySelector('#members__table');
    const table = tableContainer.querySelector('table');
    let tbody = table.querySelector('tbody');

    tbody.remove();
    tbody = document.createElement('tbody');
    table.appendChild(tbody);

    members.forEach(member => {
        const row = tbody.insertRow();
        let cells = [];

        for(let i = 0; i < 6; i++)
        {
            let cell = row.insertCell();
            cells.push(cell);
        }

        const group = GetGroup(member.id, groups);

        cells[0].innerHTML = member.id;
        cells[1].innerHTML = `${member.name} ${member.secondName}`;
        cells[2].innerHTML = `${member.start} - ${member.end}`;
        cells[3].innerHTML = `${(member.dishes.breakfast) ? 'Ś' : ''} ${(member.dishes.dinner) ? 'O' : ''} ${(member.dishes.tea) ? 'P' : ''}`;
        cells[4].innerHTML = (group >= groups.length) ? 'NULL' : groups[group].name;

        const delBtn = document.createElement('button');
        const editBtn = document.createElement('button');

        delBtn.setAttribute('onclick', `DeleteMember(${GetGroupId(member.id, groups)}, ${member.id});`);
        editBtn.setAttribute('onclick', `EditMember(${member.id});`);

        delBtn.innerHTML = 'Usuń';
        editBtn.innerHTML = 'Edytuj';

        cells[5].appendChild(delBtn);
        cells[5].appendChild(editBtn);
    });
};

const RenderAddPersonSelect = () => {
    const select = document.querySelector('#add-person__select');
    
    tools.LoadData().groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        select.appendChild(option);
        option.innerHTML = group.name;
    });
};

const FillInEditForm = (eId) => {
    const id = eId;
    const formContainer = document.querySelector('#edit-person__form__container');
    let form = document.querySelector('#edit-person__form');
    let jsonData = tools.LoadData();
    let editId = tools.GetElementOfArrayById(id, jsonData.members);
    const members = jsonData.members;
    const data = [members[editId].name, members[editId].secondName, members[editId].start, members[editId].end, members[editId].dishes.breakfast, members[editId].dishes.dinner, members[editId].dishes.tea];
    const groups = jsonData.groups;
    let memberOfGroup;

    form.remove();
    form = document.createElement('form');
    form.id = 'edit-person__form';
    formContainer.appendChild(form);

    console.log(data);

    groups.forEach(group => {
        if(group.members.includes(id))
            memberOfGroup = group.id;
    });

    for(let i = 0; i < 7; i++)
    {
        const input = document.createElement('input');
        
        if(i < 4)
        {
            input.type = "text";
            input.value = data[i];
        }
        else
        {
            input.type = "checkbox";
            input.checked = data[i];
        }

        form.appendChild(input);
    }

    const selectEditMember = document.createElement('select');
    form.appendChild(selectEditMember);

    const groupEl = tools.GetElementOfArrayById(memberOfGroup, groups);

    if(groupEl < groups.length)
    {
        const selectedOption = document.createElement('option');
        selectedOption.defaultSelected = true;
        selectedOption.value = memberOfGroup;
        selectedOption.innerHTML = groups[groupEl].name;
        selectEditMember.appendChild(selectedOption);
    }

    groups.forEach(group => {
        if(group.id != memberOfGroup)
        {
            const option = document.createElement('option');
            option.value = group.id;
            option.innerHTML = group.name;
            selectEditMember.appendChild(option);
        }
    });

    const saveBtn = document.createElement('button');
    saveBtn.setAttribute('onclick', `SaveChanges(${id});`);
    saveBtn.setAttribute('type', 'button');
    saveBtn.innerHTML = 'Zapisz';

    form.appendChild(saveBtn);
};

exports.RenderGroupsTable = RenderGroupsTable;
exports.RenderAddPersonSelect = RenderAddPersonSelect;
exports.RenderMembersTable = RenderMembersTable;
exports.FillInEditForm = FillInEditForm;