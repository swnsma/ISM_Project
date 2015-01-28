/**
 * Created by Таня on 22.01.2015.
 */
//наслідується від простого календара // налаштування календара
function Calendar_teacher(){
    var self=this;
    Calendar.call(this);
    this.option.dayClick=function(date, allDay, jsEvent, view) {
        self.jqueryObject.popup.tcalInput.val(date._d.getDate()+'-'+ (date._d.getMonth()+1)+'-'+date._d.getFullYear());
        self.jqueryObject.popup.day.day.val(date._d.getDate());
        self.jqueryObject.popup.day.month.val(date._d.getMonth()+1);
        self.jqueryObject.popup.day.year.val(date._d.getFullYear());
        self.jqueryObject.popup.popup.show();
        self.jqueryObject.popup.typePopup.val('');
        self.jqueryObject.popup.start.hour.val('14');
        self.jqueryObject.popup.start.minutes.val('00');
        self.jqueryObject.popup.end.hour.val('16');
        self.jqueryObject.popup.end.minutes.val('00');
        //маг метод з файла tcal.js , що б зкинути налаштування маленького календарика
        f_tcalCancel();

        var x= allDay.pageX;
        var y = allDay.pageY;
        x=x-self.jqueryObject.popup.popup.css('width').slice(0,self.jqueryObject.popup.popup.css('width').length-2)/2;
        self.jqueryObject.popup.popup.css({
            'left':x,
            'top':y
        });
    };

    this.jqueryObject.calendar.fullCalendar(this.option);

    this.focusDeleted=function(){
        function focusDelete(item){
            var a ='';
            item.on('focus',function(){
                a=this.value;
                this.value='';
            });
            item.on('focusout',function(){
                if(this.value===''){
                    this.value=a;
                }
            })
        }
        focusDelete(this.jqueryObject.popup.day.day);
        focusDelete(this.jqueryObject.popup.day.month);
        focusDelete(this.jqueryObject.popup.day.year);
        focusDelete(this.jqueryObject.popup.start.hour);
        focusDelete(this.jqueryObject.popup.start.minutes);
        focusDelete(this.jqueryObject.popup.end.hour);
        focusDelete(this.jqueryObject.popup.end.minutes);
    }

    //функція яка відповідає за поведення popup
    this.click_body = function(){
        $(document).click(function(event){

            ///метод який приховує popup, якщо натиснуто не на pop'api або ж на дні
            //говноКоДЭ
            var bool=false;
            var target= event.target;
            if(target.className==='fc-more'){
                bool = false;
            }else{
                if(event.target.id==='popup'||event.target.id==='tcal'|| event.target.id==='tcalNextMonth'||
                    event.target.id==='tcalPrevMonth'){
                    bool=true;
                }else{
                    var teg=$(event.target).parents('#popup')[0];
                    if(teg){
                        bool=true;
                    }
                    teg=$(event.target).parents(".fc-content-skeleton")[0];
                    if(teg){
                        bool=true;
                    }
                    teg=$(event.target).parents("#tcal")[0];
                    if(teg){
                        bool=true;
                    }
                }
            }
            if(!bool){
                var classList = $(event.target)[0].classList;
                for (var i = 0; i < classList.length; ++i) {
                    if (classList[i] === 'fc-day' || classList[i] === 'fc-day-number') {
                        bool = true;
                        break;
                    }
                }
            }
            if(!bool) {
                $('#popup').hide();
                //маг метод з файла tcal.js , що б зкинути налаштування маленького календарика
                f_tcalCancel();
            }
        });

    }

    //синхронизація маленького календарика і поля для ввода дати
    this.syncTcalInput=function(){
        var date = self.jqueryObject.popup.day;
        function sync(){
            self.jqueryObject.popup.tcalInput.val(date.day.val()+'-'+date.month.val()+'-'+date.year.val());
        }

        date.day.mask('99',{placeholder:"-----"});
        date.day.on('input',function(){
            if(this.value>31){
                this.value=31;
            }
            if(this.value.length==2){
                if(parseInt(this.value)) {
                    this.value=parseInt(this.value);
                    date.month.focus();
                }

            }
            sync();
        });

        date.month.mask('99',{placeholder:"-----"});
        date.month.on('input',function(){
            if(this.value>12){
                this.value=12;
            }
            if(this.value.length==2){
                if(parseInt(this.value)) {
                    this.value=parseInt(this.value);
                    date.year.focus();
                }
            }
            sync();
        });

        date.year.mask('9999',{placeholder:"---------"});
        date.year.on('input',function(){
            if(this.value.length==4){
                if(parseInt(this.value)) {
                    this.value=parseInt(this.value);
                    self.jqueryObject.popup.start.hour.focus();
                }
            }
            sync();
        });

        $tcalInput.on('input',function(){
            var val=this.value;
            var mas=val.split('-');
            date.day.val(mas[0]);
            date.month.val(mas[1]);
            date.year.val(mas[2]);
        });
    }

    //валідація поля дати
    this.timeIvent=function(){
        function maskEndFocus(mask,focus,type){
            mask.mask('99');
            if(type==='hour'){
                mask.on('input',function(){
                    if(this.value>23){
                        this.value=23;
                    }
                    if(this.value.length==2){
                        if(parseInt(this.value)) {
                            this.value=parseInt(this.value);
                            focus.focus();
                        }
                    }
                })
            }else{
                mask.on('input',function(){
                    if(this.value>59){
                        this.value=59;
                    }
                    if(mask!=$minutesEnd) {
                        if (this.value.length == 2) {
                            this.value = parseInt(this.value);
                            if (parseInt(this.value)) {
                                this.value = parseInt(this.value);

                                focus.focus();

                            }
                        }
                    }
                })
            }
        }
        var $hourBegin = self.jqueryObject.popup.start.hour;
        var $minutesBegin = self.jqueryObject.popup.start.minutes;
        var $hourEnd = self.jqueryObject.popup.end.hour;
        var $minutesEnd = self.jqueryObject.popup.end.minutes;
        maskEndFocus($hourBegin,$minutesBegin,'hour');
        maskEndFocus($minutesBegin,$hourEnd,'minutes');
        maskEndFocus($hourEnd,$minutesEnd,'hour');
        maskEndFocus($minutesEnd,$minutesEnd,'minutes');


    }

    //додавання нового івента
    this.addLesson=function(){
        var newDate = new Date();
        var jqueryObjectPopup  = self.jqueryObject.popup;
        jqueryObjectPopup.button.submit.on('click',function(){

            //константи
            var title= (jqueryObjectPopup.typePopup.val()||'Новый ивент');
            var year=(jqueryObjectPopup.day.year.val()||newDate.getFullYear());
            var month=(jqueryObjectPopup.day.month.val()||newDate.getMonth()+1);
            var day=(jqueryObjectPopup.day.day.val()||newDate.getDate());
            var hourBegin=(jqueryObjectPopup.start.hour.val()||'14');
            var minutesBegin=(jqueryObjectPopup.start.minutes.val()||'00');
            var hourEnd=(jqueryObjectPopup.end.hour.val()||'16');
            var minutesEnd=(jqueryObjectPopup.end.minutes.val()||'00');


            var startFun = function(){
                if(month.length!=2){
                    month='0'+month;
                }
                if(day.length!=2){
                    day='0'+day;
                }
                return year+'-'+month+'-'+day+' '+hourBegin+':'+minutesBegin+':00';
            };
            var endFun = function(){
                if(month.length!=2){
                    month='0'+month;
                }
                if(day.length!=2){
                    day='0'+day;
                }
                return year+'-'+month+'-'+day+' '+hourEnd+':'+minutesEnd+':00';
            };
            var urls=url+'app/calendar/addEvent/' + title+'/'+startFun()+'/'+endFun();
            $.ajax({
                url: urls,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(id){
                    self.jqueryObject.calendar.fullCalendar('renderEvent',{
                        id: id,
                        title: title,
                        start: startFun(),
                        end: endFun(),
                        allDay: false
                    });
                },
                error: function(er) {
                    alert(er);
                }

            });

            self.jqueryObject.popup.popup.hide();
            return false;
        });
    }
}

$(document).ready(function() {
    debugger;
    var calendar = new Calendar_teacher();
    calendar.focusDeleted();
    calendar.click_body();
    calendar.syncTcalInput();
    calendar.timeIvent();
    calendar.addLesson();


    $('#resetLesson').on('click',function() {
        f_tcalCancel();
        $('#popup').hide();
    });
});