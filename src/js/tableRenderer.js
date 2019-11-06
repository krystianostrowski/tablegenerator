const time = require('../js/time');
const tools = require('../js/tools');

const RenderThead = (table, thead, days) => {
    let cells = [];
    const numOfCells = days.length + 4;

    thead.remove();
    thead = document.createElement('thead');
    table.appendChild(thead);
    const row = thead.insertRow();

    for(let i = 0; i < numOfCells; i++)
    {
        const cell = row.insertCell();
        cells.push(cell);
    }

    cells[0].innerHTML = 'L.p';
    cells[1].innerHTML = 'Imie i nazwisko';
    cells[2].innerHTML = 'Godziny';
    cells[3].innerHTML = 'Posiłki';

    for(let i = 4; i < numOfCells; i++)
        cells[i].innerHTML = days[i - 4];
};

const RenderHeader = (group) => {
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
    pArray[1].innerHTML = `${time.monthName} ${time.year}`;
    pArray[2].innerHTML = `wych. ${group.tutor}`;
};

const RenderPersons = (group, table, tbody, numOfDays) => {
    const members = tools.LoadData().members;
    let counter = 1;

    tbody.remove();
    tbody = document.createElement('tbody');
    table.appendChild(tbody);

    group.members.forEach(member => {
        const row = tbody.insertRow();
        const cells = [];

        for(let i = 0; i < numOfDays + 4; i++)
        {   
            const cell = row.insertCell();
            cells.push(cell);
        }
        
        const index = tools.GetElementOfArrayById(member, members);

        cells[0].innerHTML = counter;
        cells[1].innerHTML = `${members[index].name} ${members[index].secondName}`;
        cells[2].innerHTML = `${members[index].start} - ${members[index].end}`;
        cells[3].innerHTML = `${(members[index].dishes.breakfast) ? 'Ś' : ''} ${(members[index].dishes.dinner) ? 'O' : ''} ${(members[index].dishes.tea) ? 'P' : ''}`;
        
        counter++;
    });
};

const RenderTable = (groupId, month, year) => {
    const groups = tools.LoadData().groups;
    const group = groups[tools.GetElementOfArrayById(groupId, groups)];
    const table = document.querySelector('#main-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    //console.log("RenderTable:" + month);

    const days = time.GetDays(month, year);

    RenderHeader(group);
    RenderThead(table, thead, days);
    RenderPersons(group, table, tbody, days.length);
};

const RenderGroupSelect = (select) => {
    let optionsContainer = select.querySelector('#select__options__container');

    optionsContainer.remove();

    optionsContainer = document.createElement('optgroup');
    optionsContainer.id = 'select__options__container';
    optionsContainer.setAttribute('label', 'Grupy');
    select.appendChild(optionsContainer);

    const groups = tools.LoadData().groups;
    let counter = 1;

    groups.forEach(group => {
        const option = document.createElement('option');

        option.value = group.id;
        option.innerHTML = group.name;

        if(counter == 1)
        {
            option.defaultSelected = true;
            counter++;
        }

        optionsContainer.appendChild(option);
    });
};

exports.RenderTable = RenderTable;
exports.RenderGroupSelect = RenderGroupSelect;