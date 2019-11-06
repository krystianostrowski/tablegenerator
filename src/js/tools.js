const fs = require('fs');

//const dbPath = './resources/app/json/db.json';            //Path to JSON database
const dbDir = `${process.env.APPDATA}\\table-generator`;
const dbFile = 'database.json';
const dbPath = `${dbDir}\\${dbFile}`;

//Getting index of Objects array by id
const GetElementOfArrayById = (id, json) => {
    let counter = 0;

    for(let i = 0; i < json.length; i++)
    {
        if(json[i].id == id)
            break;
        else
            counter++;
    }

    return counter;
};

//Getting data from JSON database
const GetData = (id = null) => {
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

    let json = fs.readFileSync(dbPath, (err, data) => {
        if(err) 
            return console.log(err.message);
        
        return data;
    });

    json = JSON.parse(json);

    if(id == null)
        return json;
    else 
    {
        const index = GetElementOfArrayById(id, json);
        json[index];
    }
};

//Saving data to JSON file
const SaveData = json => {
    fs.writeFileSync(dbPath, JSON.stringify(json, null, 2), (err) => {
        if(err)
            return console.error(err.message);
    });
};

//Adding group to database
const AddGroup = (name, tutor) => {
    let data = GetData();

    data.groups.push({id: (data.groups.length == 0) ? 1 : data.groups[data.groups.length - 1].id + 1, 
                name: name, 
                tutor: tutor, 
                members: []
            });

    SaveData(data);
};

//Removing group from database by ID
const RemoveGroup = id => {
    let data = GetData();
    let elToRemove = GetElementOfArrayById(id, data.groups);

    data.groups.splice(elToRemove, 1);

    SaveData(data);
};

//Adding new member to group
const AddMember = (groupId, name, surname, hoursFrom, hoursTo, hasBreakfast, hasDinner, hasTea) => {
    let data = GetData();
    let group = GetElementOfArrayById(groupId, data.groups);
    let id = 0;

    if(data.members.length != 0)
        id = data.members[data.members.length - 1].id + 1;

    data.members.push({id: id, name: name, secondName: surname, start: hoursFrom, end: hoursTo, dishes: {breakfast: hasBreakfast, dinner: hasDinner, tea: hasTea}});
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
const RemoveMember = (gId, mId) => {
    let data = GetData();
    const group = GetElementOfArrayById(gId, data.groups);
    const member = GetElementOfArrayById(mId, data.members);

    const groupMembers = data.groups[group].members;
    groupMembers.splice(groupMembers.indexOf(mId), 1);
    data.members.splice(member, 1);

    SaveData(data);
};

const EditMember = (groupId, memberId, name, surname, hoursFrom, hoursTo, hasBreakfast, hasDinner, hasTea) => {
    let data = GetData();
    let groups = data.groups;
    let currentGroup = -1;
    let newGroup = -1;

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

    let member = GetElementOfArrayById(memberId, data.members);

    groups.forEach(group => {
        if(group.members.includes(data.members[member].id))
            currentGroup = GetElementOfArrayById(group.id, groups);
    });

    newGroup = GetElementOfArrayById(groupId, groups);

    console.log("Current: " + currentGroup);
    console.log("New: " + newGroup);

    if(currentGroup != newGroup)
    {
        const memberToRemove = groups[currentGroup].members.indexOf(memberId);
        console.log(memberToRemove);
        console.log(memberId);
        data.groups[currentGroup].members.splice(memberToRemove, 1);

        data.groups[newGroup].members.push(memberId);
        data.groups[newGroup].members.sort(compare);
    }

    data.members[member].name = name;
    data.members[member].secondName = surname;
    data.members[member].start = hoursFrom;
    data.members[member].end = hoursTo;
    data.members[member].dishes.breakfast = hasBreakfast;
    data.members[member].dishes.dinner = hasDinner;
    data.members[member].dishes.tea = hasTea;

    SaveData(data);
};

module.exports = {
    LoadData: (id = null) => {
        return GetData(id);
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
    }
}