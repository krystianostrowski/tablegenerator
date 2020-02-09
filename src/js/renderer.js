const { ipcRenderer } = require('electron');
const customTitlebar = require('custom-electron-titlebar');
const modalsRenderer = require('../js/modals');
const tableRenderer = require('../js/tableRenderer');
const time = require('../js/time');
const appVersion = require('electron').remote.app.getVersion();

const modals = document.querySelectorAll('.modal');     //Array of modals nodes
var activeModal = null;                                 //Currently active modal
var btn;                                                //Modal's close button
const printBtn = document.querySelector('#print__btn'); //print button

//Creating custom TitleBar
let MyTitlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#434343'),
    shadow: true
});

//Updating Title on Titlebar
MyTitlebar.updateTitle(`Table Generator ${appVersion}`);

//adding print button click event
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
            else if(modalClassList.contains('manage-group-members'))
            {
                modalsRenderer.RenderManageGroupMembers();
            }
        }
    });
});

/*Update events*/
ipcRenderer.on('downloading-update', () => {
    //Displaying update info
    const updateNode = document.querySelector('.update');
    //const dots = updateNode.querySelectorAll('.dot');

    updateNode.classList.toggle('update--hidden');

    //TODO: Dots animation
});

ipcRenderer.on('downloaded-update', () => {
    const updateNode = document.querySelector('.update');
    const downloading = updateNode.querySelector('#update--downloading');
    const downloaded = updateNode.querySelector('#update--downloaded');
    const installBtn = updateNode.querySelector('#installBtn');
    const laterBtn = updateNode.querySelector('#leterBtn');
    
    downloaded.classList.toggle('hidden');
    downloading.classList.toggle('hidden');

    installBtn.addEventListener('click', () => ipcRenderer.send('install-update'));

    laterBtn.addEventListener('click', () => updateNode.classList.toggle('update--hidden'));
});

//Event called when PDF file was write
ipcRenderer.on('wrote-pdf', (event, path) => {
    const message = `Wrote PDF to: ${path}`;

    console.log(message);

    ipcRenderer.send('remove-PDF', path);
});

//Called when pressed print button
ipcRenderer.on('print', () => {
    //Sending event to main thread
    ipcRenderer.send('print-to-pdf');
});

//hides current showing modal and removes modal's button event listener
const exitButtonFunction = () => {
    btn.removeEventListener('click', exitButtonFunction);

    activeModal.classList.toggle('modal--visible');
    activeModal = null;
};

//Rendering table
const optionsContainer = document.querySelector('.options');        //options parent
const selects = optionsContainer.querySelectorAll('select');        //options - select group
const groups = tools.LoadData().groups;                             //array of groups from database

//rendering table
if(groups.length > 0)
    tableRenderer.RenderTable(groups[0].id, time.month, time.year);

//rendering group select in options
tableRenderer.RenderGroupSelect(selects[0]);

//rendering time selects in options
time.RenderTimeSelects(selects[1], selects[2]);

//adding change event to all selects in options
optionsContainer.addEventListener('change', e => {
    //refreshing table after options changed
    if(e.target.classList.contains('options__select')) 
        tableRenderer.RenderTable(selects[0].value, selects[1].value, selects[2].value);
});