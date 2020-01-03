const fs = require('fs');

const dbDir = `${process.env.APPDATA}\\table-generator`;    //JSON database directory
const dbFile = 'database.json';                             //database file
const dbPath = `${dbDir}\\${dbFile}`;                       //Path to JSON database

/**
 * @description This function gets index of object in array by object id
 * @param {int} id - id to select object
 * @param {Array} json - objects array
 * @returns index of object in array
 */
const GetElementOfArrayById = (id, json) => {
    let counter = 0;        //index counter

    //looping through all objects in array
    for(let i = 0; i < json.length; i++)
    {
        //if object id == given id break loop else increment counter
        if(json[i].id == id)
            break;
        else
            counter++;
    }

    return counter;
};

/**
 * @description This function checks if database exists.
 * If it isn't exists functions creates it
 */
const CheckIfDatabaseExists = () =>
{
    if(!fs.existsSync(dbDir))
        fs.mkdirSync(dbDir);

    if(!fs.existsSync(dbPath))
    {   
        const defaultData = { "members": [], "groups": [] };
        fs.writeFileSync(dbPath, JSON.stringify(defaultData, null, 2), (err) => {
            if(err)
                return console.error(err.message);
        });
    }
}

/**
 * @description This function gets data from database
 * @returns JSON object of data from database
 */
const GetData = () => {
    //checking if database exists
    CheckIfDatabaseExists();

    //reading data from file
    let json = fs.readFileSync(dbPath, (err, data) => {
        if(err) 
            return console.log(err.message);
        
        return data;
    });

    //parsing JSON (data from database)
    json = JSON.parse(json);

    return json;
};

/**
 * @description This function saves data to database
 * @param {JSON} json - data to save
 */
const SaveData = json => {
    fs.writeFileSync(dbPath, JSON.stringify(json, null, 2), (err) => {
        if(err)
            return console.error(err.message);
    });
};

/**
 * @description This function adds group to database
 * @param {string} name 
 * @param {string} tutor 
 */
const AddGroup = (name, tutor) => {
    let data = GetData();

    data.groups.push({id: (data.groups.length == 0) ? 1 : data.groups[data.groups.length - 1].id + 1, 
                name: name, 
                tutor: tutor, 
                members: []
            });

    SaveData(data);
};

/**
 * @description This function removes group from database by group id
 * @param {int} id - id of group to remove 
 */
const RemoveGroup = id => {
    let data = GetData();
    let elToRemove = GetElementOfArrayById(id, data.groups);

    data.groups.splice(elToRemove, 1);

    SaveData(data);
};

//Adding new member to group
/**
 * @description This function adds new member to database
 * @param {*} groupId - group id to which the member will be added
 * @param {string} name - member name
 * @param {string} surname - member surname
 * @param {*} hoursFrom - start time
 * @param {*} hoursTo - end time
 * @param {boolean} hasBreakfast - if member has breakfast 
 * @param {boolean} hasDinner - if member has dinner
 * @param {boolean} hasTea - if member has tea
 */
const AddMember = (groupId, name, surname, hoursFrom, hoursTo, hasBreakfast, hasDinner, hasTea) => {
    let data = GetData();                                       //all data from database
    let group = GetElementOfArrayById(groupId, data.groups);    //index of gropu in groups array
    let id = 0;                                                 //member id

    //setting member id
    if(data.members.length != 0)
        id = data.members[data.members.length - 1].id + 1;

    //adding member to members 
    data.members.push({id: id, name: name, secondName: surname, start: hoursFrom, end: hoursTo, dishes: {breakfast: hasBreakfast, dinner: hasDinner, tea: hasTea}});

    //adding member to group
    data.groups[group].members.push(id);

    //Comparing function for sorting
    const compare = (a, b) => {
        a = GetElementOfArrayById(a, data.members);
        b = GetElementOfArrayById(b, data.members);

        if(data.members[a].secondName < data.members[b].secondName)
            return -1;
        
        if(data.members[a].secondName > data.members[b].secondName)
            return 0;

        if(data.members[a].secondName === data.members[b].secondName)
        {
            if(data.members[a].name < data.members[b].name)
                return -1;

            if(data.members[a].name > data.members[b].name)
                return 1;

            return 0;
        }
    };

    //Sorting mebers alphabetically by surname and name
    data.groups[group].members.sort(compare);

    SaveData(data);
}

//Removing member from group
/**
 * @description This function removes member from group and database
 * @param {*} gId - group id 
 * @param {*} mId - member id
 */
const RemoveMember = (gId, mId) => {
    let data = GetData();                                       //all data from database
    const group = GetElementOfArrayById(gId, data.groups);      //index of group in groups array
    const member = GetElementOfArrayById(mId, data.members);    //index of member in members array

    if(group < data.groups.length)
    {
        const groupMembers = data.groups[group].members;            //all members in group

        //removing member from group
        groupMembers.splice(groupMembers.indexOf(mId), 1);
    }
    
    //remove member from database
    data.members.splice(member, 1);

    SaveData(data);
};

/**
 * @description This function edits member data
 * @param {*} groupId - group id to which the member will be added
 * @param {*} memberId - member to edit id
 * @param {string} name - member name
 * @param {string} surname - member surname
 * @param {*} hoursFrom - start time
 * @param {*} hoursTo - end time
 * @param {boolean} hasBreakfast - if member has breakfast 
 * @param {boolean} hasDinner - if member has dinner
 * @param {boolean} hasTea - if member has tea
 */
const EditMember = (groupId, memberId, name, surname, hoursFrom, hoursTo, hasBreakfast, hasDinner, hasTea) => {
    let data = GetData();       //all data from database
    let groups = data.groups;   //groups array
    let currentGroup = -1;      //gurrent group index in groups array
    let newGroup = -1;          //new group index in groups array

    //Comparing function for sorting
    const compare = (a, b) => {
        a = GetElementOfArrayById(a, data.members);
        b = GetElementOfArrayById(b, data.members);

        if(data.members[a].secondName < data.members[b].secondName)
            return -1;
        
        if(data.members[a].secondName > data.members[b].secondName)
            return 0;

        if(data.members[a].secondName === data.members[b].secondName)
        {
            if(data.members[a].name < data.members[b].name)
                return -1;

            if(data.members[a].name > data.members[b].name)
                return 1;

            return 0;
        }
    };

    let member = GetElementOfArrayById(memberId, data.members);    //member index in members array

    //setting currentGroup index
    groups.forEach(group => {
        if(group.members.includes(data.members[member].id))
            currentGroup = GetElementOfArrayById(group.id, groups);
    });

    //setting new group index
    newGroup = GetElementOfArrayById(groupId, groups);

    //changing member group
    if(currentGroup != newGroup)
    {
        if(currentGroup != -1)
        {
            //member index in current group members
            const memberToRemove = groups[currentGroup].members.indexOf(memberId);

            //removing member from current group
            data.groups[currentGroup].members.splice(memberToRemove, 1);
        }

        //adding member to new group
        data.groups[newGroup].members.push(memberId);
    }
    
    //setting all member data
    data.members[member].name = name;
    data.members[member].secondName = surname;
    data.members[member].start = hoursFrom;
    data.members[member].end = hoursTo;
    data.members[member].dishes.breakfast = hasBreakfast;
    data.members[member].dishes.dinner = hasDinner;
    data.members[member].dishes.tea = hasTea;

    //sorting new group
    data.groups[newGroup].members.sort(compare);

    SaveData(data);
};

const ChangeGroup = (memberId, groupId) => {
    let data = GetData();
    const groupIndex = GetElementOfArrayById(groupId, data.groups);
    let currentGroupId = -1;
    let currentGroupIndex = -1;

    //Comparing function for sorting
    const compare = (a, b) => {
        a = GetElementOfArrayById(a, data.members);
        b = GetElementOfArrayById(b, data.members);

        if(data.members[a].secondName < data.members[b].secondName)
            return -1;
        
        if(data.members[a].secondName > data.members[b].secondName)
            return 0;

        if(data.members[a].secondName === data.members[b].secondName)
        {
            if(data.members[a].name < data.members[b].name)
                return -1;

            if(data.members[a].name > data.members[b].name)
                return 1;

            return 0;
        }
    };

    const memberIndex = GetElementOfArrayById(memberId, data.members);

    console.log(`Member index: ${memberIndex}`);

    data.groups.forEach(group => {
        if(group.members.includes(data.members[memberIndex].id))
        {
            currentGroupIndex = GetElementOfArrayById(group.id, data.groups);
            currentGroupId = group.id;
        }
    });

    if(currentGroupId != groupId)
    {
        console.log(`Current Group: ${currentGroupId}`);
        if(currentGroupId != -1 && currentGroupIndex != -1)
        {
            memberId = parseInt(memberId);
            //member index in current group members
            const memberToRemove = data.groups[currentGroupIndex].members.indexOf(memberId);

            //removing member from current group
            data.groups[currentGroupIndex].members.splice(memberToRemove, 1);

            //adding member to new group
            data.groups[groupIndex].members.push(memberId);

            //sorting group after adding a new member
            data.groups[groupIndex].members.sort(compare);

            SaveData(data);
        }
    }
};

module.exports = {
    LoadData: () => {
        return GetData();
    },
    AddGroup: (name, tutor) => {
        AddGroup(name, tutor);
    },
    RemoveGroup: id => {
        RemoveGroup(id);
    },
    AddMember: (groupId, name, surname, hoursFrom, hoursTo, hasBreakfast, hasDinner, hasTea) => {
        AddMember(groupId, name, surname, hoursFrom, hoursTo, hasBreakfast, hasDinner, hasTea);
    },
    RemoveMember: (gId, mId) => {
        RemoveMember(gId, mId);
    },
    GetElementOfArrayById: (id, json) => {
        return GetElementOfArrayById(id, json);
    },
    EditMember: (groupId, memberId, name, surname, hoursFrom, hoursTo, hasBreakfast, hasDinner, hasTea) => {
        EditMember(groupId, memberId, name, surname, hoursFrom, hoursTo, hasBreakfast, hasDinner, hasTea);
    },
    CheckIfDatabaseExists: () => {
        CheckIfDatabaseExists();
    },
    ChangeGroup: (memberId, groupId) => {
        ChangeGroup(memberId, groupId);
    }
}