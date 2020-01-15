const tools = require('../js/tools');       //requires toosl module

/**
 * @desc This function return id of the group 
 * to which the member belongs
 * @param {int} id - member id
 * @param {Objests[]} gropus - array of groups
 * @returns {int} - id of the group to which the member belongs 
*/
const GetGroupId = (id, groups) => {
    let gId = 0;

    groups.forEach(group => {
        if(group.members.includes(id))
            gId = group.id;
    });

    return gId;
};

/**
 * @description This function gets index of the group to which the member belongs
 * @param {int} id - member id
 * @param {Objests[]} groups - array of groups
 * @returns {int} - index of group
 */
const GetGroup = (id, groups) => {
    //getting group id which memeber belongs to
    let gId = GetGroupId(id, groups);

    return tools.GetElementOfArrayById(gId, groups);
};

/**
 * @description This function renders groups table
 */
const RenderGroupsTable = () => {
    const groups = tools.LoadData().groups;                         //array of group objects
    let tbody = document.querySelector('#groups__table__body');     //tbody of groups table
    const table = document.querySelector('#groups__table');         //gropus table

    //removing tbody
    tbody.remove();

    //adding new tbody element
    tbody = document.createElement('tbody');
    tbody.setAttribute('id', 'groups__table__body');
    table.appendChild(tbody);

    //looping for each group 
    groups.forEach(group => {
        //creating new row
        let tr = document.createElement('tr');
        tbody.appendChild(tr);

        let tds = [];   //array of cells

        //creating cells
        for(let i = 0; i <= 3; i++)
        {
            let td = document.createElement('td');
            tr.appendChild(td);
            tds[i] = td;
        }

        //creating delete group button
        let btn = document.createElement('button');
        btn.innerHTML = "Usuń";
        btn.setAttribute('onclick', 'DeleteGroup(' + group['id'] + ');');

        //filling in cells
        tds[0].innerHTML = group['id'];
        tds[1].innerHTML = group['name'];
        tds[2].innerHTML = group['tutor'];
        tds[3].appendChild(btn);
    });
};

/**
 * @description This function renders members table
 */
const RenderMembersTable = () => {
    const json = tools.LoadData();                                          //all data from database
    const members = json.members;                                           //members from database
    const groups = json.groups;                                             //groups from database
    const tableContainer = document.querySelector('#members__table');       //members table parent
    const table = tableContainer.querySelector('table');                    //members table
    let tbody = table.querySelector('tbody');                               //members table tbody

    //clearing tbody
    tbody.remove();
    tbody = document.createElement('tbody');
    table.appendChild(tbody);

    //looping for each members
    members.forEach(member => {
        //creating new row
        const row = tbody.insertRow();
        
        //array of cells
        let cells = [];

        //creating cells and pushing to cells array
        for(let i = 0; i < 6; i++)
        {
            let cell = row.insertCell();
            cells.push(cell);
        }

        //index of group which member belongs to
        const group = GetGroup(member.id, groups);

        //filling cells with member data
        cells[0].innerHTML = member.id;
        cells[1].innerHTML = `${member.name} ${member.secondName}`;
        cells[2].innerHTML = `${member.start} - ${member.end}`;
        cells[3].innerHTML = `${(member.dishes.breakfast) ? 'Ś' : ''} ${(member.dishes.dinner) ? 'O' : ''} ${(member.dishes.tea) ? 'P' : ''}`;
        cells[4].innerHTML = (group >= groups.length) ? 'NULL' : groups[group].name;

        //creating delete and edit buttons
        const delBtn = document.createElement('button');
        const editBtn = document.createElement('button');

        //setting up delete and edit buttons
        delBtn.setAttribute('onclick', `DeleteMember(${GetGroupId(member.id, groups)}, ${member.id});`);
        editBtn.setAttribute('onclick', `EditMember(${member.id});`);
        delBtn.innerHTML = 'Usuń';
        editBtn.innerHTML = 'Edytuj';

        //adding buttons to the table
        cells[5].appendChild(delBtn);
        cells[5].appendChild(editBtn);
    });
};

//TODO: Add clearing select before re-rendering it

/**
 * @description This function renders group selcect in add person form
 */
const RenderAddPersonSelect = () => {
    const select = document.querySelector('#add-person__select');   //group select element in add person form
    
    while(select.firstChild)
        select.removeChild(select.firstChild);

    //looping for each group in database and pushing it to select element
    tools.LoadData().groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        select.appendChild(option);
        option.innerHTML = group.name;
    });
};

/**
 * @description This functions creating edit person form and fills in inputs
 * @param {int} eId - member to edit id
 */
const FillInEditForm = (eId) => {
    const id = eId;                                                                     //member id
    const formContainer = document.querySelector('#edit-person__form__container');      //edit person form parent
    let form = document.querySelector('#edit-person__form');                            //edit person form
    let jsonData = tools.LoadData();                                                    //all data from database
    const members = jsonData.members;                                                   //array of members from database
    let editId = tools.GetElementOfArrayById(id, members);                              //index of member to edit from members array
    //all member to edit data
    const data = [members[editId].name, members[editId].secondName, members[editId].start, members[editId].end, members[editId].dishes.breakfast, members[editId].dishes.dinner, members[editId].dishes.tea];
    const groups = jsonData.groups;                                                     //array of groups from database
    let memberOfGroup = GetGroup(id, groups);                                           //index of group which member belongs to
    let checkboxCounter = 0;                                                            //counts checkboxes
    const checkboxLabels = ['Śniadanie', 'Obiad', 'Podwieczorek'];                      //array of labels for checkboxes

    //clearing form
    form.remove();
    form = document.createElement('form');
    form.id = 'edit-person__form';
    formContainer.appendChild(form);

    //crating inputs and filling it
    for(let i = 0; i < 7; i++)
    {
        let input = document.createElement('input');
        
        if(i < 4)
        {
            input.type = "text";
            input.value = data[i];
        }
        else
        {
            const label = document.createElement('label');
            const span = document.createElement('span');

            input.type = "checkbox";
            input.checked = data[i];

            span.innerHTML = checkboxLabels[checkboxCounter];

            label.appendChild(input);
            label.appendChild(span);

            input = label;

            checkboxCounter++;
        }

        form.appendChild(input);
    }

    //creating group select
    const selectEditMember = document.createElement('select');
    form.appendChild(selectEditMember);

    //adding others groups to group select
    groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.innerHTML = group.name;

            if(memberOfGroup < groups.length)
                if(group.id == groups[memberOfGroup].id )
                    option.defaultSelected = true;

            selectEditMember.appendChild(option);
    });

    //creating save button
    const saveBtn = document.createElement('button');
    saveBtn.setAttribute('onclick', `SaveChanges(${id});`);
    saveBtn.setAttribute('type', 'button');
    saveBtn.innerHTML = 'Zapisz';

    form.appendChild(saveBtn);
};

/**
 * This function renders manage group members modal
 */
const RenderManageGroupMembers = () => {
    const data = tools.LoadData();
    const members = data.members;
    const groups = data.groups;
    
    const table = document.querySelector('#group-members__table');

    while(table.firstChild)
        table.removeChild(table.firstChild);

    const thead = document.createElement('thead');
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const theadRow = thead.insertRow();

    theadRow.insertCell().innerHTML = 'Imię i nazwisko';

    groups.forEach(group => theadRow.insertCell().innerHTML = group.name);

    members.forEach(member => {
        const row = tbody.insertRow();

        row.insertCell().innerHTML = `${member.secondName} ${member.name}`;

        for(let i = 0; i < groups.length; i++)
        {
            const cell = row.insertCell();
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = member.id;

            if(groups[i].members.includes(member.id))
                radio.checked = true;
                
            radio.setAttribute('groupid', groups[i].id);

            cell.appendChild(radio);
        }
    });
};

exports.RenderManageGroupMembers = RenderManageGroupMembers;
exports.RenderGroupsTable = RenderGroupsTable;
exports.RenderAddPersonSelect = RenderAddPersonSelect;
exports.RenderMembersTable = RenderMembersTable;
exports.FillInEditForm = FillInEditForm;