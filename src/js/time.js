//Array of months in Polish
const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

const date = new Date();                    //Getting date from computer
const currentMonth = date.getMonth();       //Current month by computer time
const currentYear = date.getFullYear();     //Current year

const GetLastDayOfMonth = (month, year) => {
    month++;
    const date = new Date(year, month, 0);
    const lastDay = date.getDate();

    /*console.log("GLDOM: " + month);
    console.log("GLDOM: " + date);*/

    return lastDay;
};

const GetDays = (month, year) => {
    const days = [];
    const numOfDays = GetLastDayOfMonth(month, year);

    //console.log("GetDays (numOfDays): " + numOfDays);

    for(let i = 1; i <= numOfDays; i++)
    {
        let date = new Date(year, month, i);
        let dayOfWeek = date.getDay();

        if(dayOfWeek != 0 && dayOfWeek != 6)
            days.push(date.getDate());

        /*if(i == 1)
        {
            console.log("GetDays (Month): " + month);
            console.log("GetDays (Date): " + date);
        }*/
    }

    return days;
}

const RenderTimeSelects = (monthsSelect, years) => {
    months.forEach(month => {
        const option = document.createElement('option');

        if(months.indexOf(month) == currentMonth)
            option.defaultSelected = true;

        option.value = months.indexOf(month);
        option.innerHTML = month;

        monthsSelect.appendChild(option);
    });

    for(let i = 0; i < 2; i++)
    {
        const option = document.createElement('option');

        if(currentYear == currentYear + i)
            option.defaultSelected = true;

        option.value = currentYear + i;
        option.innerHTML = currentYear + i;

        years.appendChild(option);
    }
}

exports.GetDays = GetDays;
module.exports = {
    month: currentMonth,
    monthName: months[currentMonth],
    year: currentYear,
    RenderTimeSelects: (monthsSelect, years) => {
        RenderTimeSelects(monthsSelect, years);
    },
    GetDays: (month, year) => {
        return GetDays(month, year);
    }
};