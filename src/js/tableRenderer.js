const time = require('../js/time');
const tools = require('../js/tools');

/**
 * @description This function renders main table thead
 * @param {Element} table - table element
 * @param {Element} thead - thead element
 * @param {int[]} days - array of days
 */
const RenderThead = (table, thead, days) => {
    let cells = [];                         //array of cells
    const numOfCells = days.length + 4;     //number of cells to render

    //clearing thead
    thead.remove();
    thead = document.createElement('thead');
    table.appendChild(thead);

    //inserting row to thead
    const row = thead.insertRow();

    //crating cells and pushing it to cells array
    for(let i = 0; i < numOfCells; i++)
    {
        const cell = row.insertCell();
        cells.push(cell);
    }

    //filling in cells
    cells[0].innerHTML = 'L.p';
    cells[1].innerHTML = 'Imie i nazwisko';
    cells[2].innerHTML = 'Godziny';
    cells[3].innerHTML = 'Posiłki';

    for(let i = 4; i < numOfCells; i++)
        cells[i].innerHTML = days[i - 4];
};

/**
 * @description This function renders header
 * @param {Object} group - group to render object 
 */
const RenderHeader = (group, month, year) => {
    const header = document.querySelector('.header');
    
    const ps = header.querySelectorAll('p');

    if(ps != null)
        ps.forEach(p => {
            p.remove();
        });

    let pArray = [];

    for(let i = 0; i < 3; i++)
    {
        const p = document.createElement('p');
        pArray.push(p);
        header.appendChild(p);
    }

    pArray[0].innerHTML = group.name;
    pArray[1].innerHTML = `${time.GetMonthName(month)} ${year}`;
    pArray[2].innerHTML = `wych. ${group.tutor}`;
};

/**
 * @description This function renders persons and attendence list for them
 * @param {Object} group - group to render
 * @param {Element} table - table element
 * @param {Element} tbody - tbody element
 * @param {int} numOfDays - number of days to render 
 */
const RenderPersons = (group, table, tbody, numOfDays) => {
    const members = tools.LoadData().members;       //array of member form database
    let counter = 1;                                //members counter. Used to assign numbers to members

    //clearing tbody
    tbody.remove();
    tbody = document.createElement('tbody');
    table.appendChild(tbody);

    //looping for each member in group
    group.members.forEach(member => {
        //inserting row to tbody
        const row = tbody.insertRow();

        //array of cells
        const cells = [];

        //crating cells and pushing it to cells array
        for(let i = 0; i < numOfDays + 4; i++)
        {   
            const cell = row.insertCell();
            cells.push(cell);
        }
        
        //member index in members array
        const index = tools.GetElementOfArrayById(member, members);

        //filling in cells
        cells[0].innerHTML = counter;
        cells[1].innerHTML = `${members[index].name} ${members[index].secondName}`;
        cells[2].innerHTML = `${members[index].start} - ${members[index].end}`;
        cells[3].innerHTML = `${(members[index].dishes.breakfast) ? 'Ś' : ''} ${(members[index].dishes.dinner) ? 'O' : ''} ${(members[index].dishes.tea) ? 'P' : ''}`;
        
        counter++;
    });
};

/**
 * @description This function renders table and header
 * @param {int} groupId - group id to render 
 * @param {int} month - month to render
 * @param {int} year -year to render
 */
const RenderTable = (groupId, month, year) => {
    const groups = tools.LoadData().groups;                                 //array of groups form database
    const group = groups[tools.GetElementOfArrayById(groupId, groups)];     //group object
    const table = document.querySelector('#main-table');                    //table element
    const thead = table.querySelector('thead');                             //thead element
    const tbody = table.querySelector('tbody');                             //tbody element

    const days = time.GetDays(month, year);                                 //array of working day in month

    //rendering
    RenderHeader(group, month, year);
    RenderThead(table, thead, days);
    RenderPersons(group, table, tbody, days.length);
};

/**
 * @description This function rendering group select in options
 * @param {Element} select - group select element
 */
const RenderGroupSelect = (select) => {
    let currentGroupId = -1;

    if(select.value != '')
        currentGroupId = select.value;


    while(select.firstChild)
        select.removeChild(select.firstChild);

    const groups = tools.LoadData().groups;         //array of groups form database
    let counter = 1;                                //groups counter

    groups.forEach(group => {
        const option = document.createElement('option');

        option.value = group.id;
        option.innerHTML = group.name;

        //if it's first option mark it as selected
        if(counter == 1 && currentGroupId == -1)
        {
            option.defaultSelected = true;
            counter++;
        }
        else if(group.id == currentGroupId && currentGroupId != -1)
            option.defaultSelected = true;

        select.appendChild(option);
    });
};

exports.RenderTable = RenderTable;
exports.RenderGroupSelect = RenderGroupSelect;