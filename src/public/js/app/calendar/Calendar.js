/**
 * Created by Таня on 23.01.2015.
 */
function Calendar(id){
    //var calendar = $(id);
    this.option={
        //editable: true,
        eventLimit: true, // for all non-agenda views
        firstDay: 1,
        header: {

        },
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Ноя.', 'Дек.'],
        dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        dayNamesShort: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
        buttonText: {
            today: "Сегодня",
            month: "Месяц",
            week: "Неделя",
            day: "День"
        },
        timeFormat: 'H(:mm)'// uppercase H for 24-hour clock
        //eventClick: function(event, element) {
        //    debugger;
        //    event.title = "CLICKED!";
        //
        //    $('#calendar').fullCalendar('updateEvent', event);
        //
        //},
        //events: [
        //    {
        //        title  : 'event1',
        //        start  : '2015-01-01'
        //    },
        //    {
        //        title  : 'event3',
        //        start  : '2015-1-9T12:30:00',
        //        allDay : false // will make the time show
        //    },{
        //        title  : 'event3',
        //        start  : '2015-01-09T12:30:00',
        //        allDay : false // will make the time show
        //    },{
        //        title  : 'event3',
        //        start  : '2015-01-09T12:30:00',
        //        allDay : false // will make the time show
        //    },{
        //        title  : 'event3',
        //        start  : '2015-01-09T12:30:00',
        //        allDay : false // will make the time show
        //    },{
        //        title  : 'event3',
        //        start  : '2015-01-09T12:30:00',
        //        allDay : false // will make the time show
        //    },{
        //        title  : 'event3',
        //        start  : '2015-01-09T12:30:00',
        //        allDay : false // will make the time show
        //    }
        //]

    };

}