//Array of months in Polish
const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

const date = new Date();                    //Getting date from computer
const currentMonth = date.getMonth();       //Current month by computer time
const currentYear = date.getFullYear();     //Current year

/**
 * @description This function gets last day of month
 * @param {int} month - month to get last dayOfWeek
 * @param {int} year - year
 * @returns last day of month
 */
const GetLastDayOfMonth = (month, year) => {
    month++;
    const date = new Date(year, month, 0);
    const lastDay = date.getDate();

    return lastDay;
};

/**
 * @description This function gets all working day in month
 * @param {int} month - month to get working days` 
 * @param {int} year - year
 * @returns array of all working days in month
 */
const GetDays = (month, year) => {
    const days = [];
    const numOfDays = GetLastDayOfMonth(month, year);

    //looping through all days in month
    for(let i = 1; i <= numOfDays; i++)
    {
        let date = new Date(year, month, i);
        let dayOfWeek = date.getDay();

        //if day != Saturday or Sunday push it to days array
        if(dayOfWeek != 0 && dayOfWeek != 6)
            days.push(date.getDate());
    }

    return days;
}

/**
 * @description This function renders month and year selects in options
 * @param {Element} monthsSelect 
 * @param {Element} years 
 */
const RenderTimeSelects = (monthsSelect, years) => {
    //looping through all months and adding it to month select
    months.forEach(month => {
        const option = document.createElement('option');

        //mark current mont as selected by default
        if(months.indexOf(month) == currentMonth)
            option.defaultSelected = true;
        
        option.value = months.indexOf(month);
        option.innerHTML = month;

        monthsSelect.appendChild(option);
    });

    //adding current and next year to select
    for(let i = -1; i < 2; i++)
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