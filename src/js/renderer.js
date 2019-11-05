const { ipcRenderer } = require('electron');
const customTitlebar = require('custom-electron-titlebar');
const modalsRenderer = require('../js/modals');
const tableRenderer = require('../js/tableRenderer');
const time = require('../js/time');

const modals = document.querySelectorAll('.modal');     //Array of modals nodes
var activeModal = null;                                 //Currently active modal
var btn;                                                //Modal's close button
const printBtn = document.querySelector('#print__btn');

//Creating custom TitleBar
let MyTitlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#434343'),
    shadow: true
});

MyTitlebar.updateTitle("Table Generator v0.6.6 (BETA)");          //Updating Title on Titlebar

printBtn.addEventListener('click', () => {
    ipcRenderer.send('print-to-pdf');
});

//called when clicked print menu
ipcRenderer.on('print-dialog', () => {
    console.log('Printing... (Not implemented yet)');
});

//rendering modals
ipcRenderer.on('render-modal', (event, data) => {
    modals.forEach(modal => {
        if(modal.classList.contains(data.modal))
        {
            if(activeModal != null)
            {
                activeModal.classList.toggle('modal--visible');
                activeModal = null;   
            }

            modal.classList.toggle('modal--visible');
            activeModal = modal;

            btn = activeModal.querySelector('.exit');

            btn.addEventListener('click', exitButtonFunction);

            const modalClassList = modal.classList;

            if(modalClassList.contains('del-group'))
            {
                modalsRenderer.RenderGroupsTable();
            }
            else if(modalClassList.contains('add-person'))
            {
                modalsRenderer.RenderAddPersonSelect();
            }
            else if(modalClassList.contains('manage-persons'))
            {
                modalsRenderer.RenderMembersTable();
            }
        }
    });
});

//Event called when PDF file was write
ipcRenderer.on('wrote-pdf', (event, path) => {
    const message = `Wrote PDF to: ${path}`;

    console.log(message);
});

//Called when pressed print button
ipcRenderer.on('print', () => {
    //Sending event to main thread
    ipcRenderer.send('print-to-pdf');
})

//hides current showing modal and removes modal's button event listener
const exitButtonFunction = () => {
    btn.removeEventListener('click', exitButtonFunction);

    activeModal.classList.toggle('modal--visible');
    activeModal = null;
};

//Rendering table
const optionsContainer = document.querySelector('.options');
const selects = optionsContainer.querySelectorAll('select');
const groups = tools.LoadData().groups;

tableRenderer.RenderTable(groups[0].id, time.month, time.year);
tableRenderer.RenderGroupSelect(selects[0]);
time.RenderTimeSelects(selects[1], selects[2]);

optionsContainer.addEventListener('change', e => {
    if(e.target.classList.contains('options__select')) 
        tableRenderer.RenderTable(selects[0].value, selects[1].value, selects[2].value);
});