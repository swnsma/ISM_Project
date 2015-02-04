/**
 * Created by Таня on 22.01.2015.
 */


masColor={
    myEvents:{
        color:'RGB(0,100,160)'
    },
    otherEvents:{
        color:'#888'
    }
}
function remove(elem) {
    return elem.parentNode ? elem.parentNode.removeChild(elem) : elem;
}


//наслідується від простого календара // налаштування календара
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};
function Calendar_teacher(){

    Calendar.call(this);

    var self=this;
    self.jqueryObject.popup.selectTeacher=$('#selectTeacher');
    self.jqueryObject.popupEdit.selectTeacher=$('#selectTeacherEdit');



    var masAction = ['create','edit'];
    var action = masAction[0];

    var idUpdate=0;
    var originalEvent=''; //останій івент на який було натиснуто
    var orig2='';
    var lastDate;
    var lasSelecrDay;

    var lastEvent;
    var lastEventColor;


    var currentUser=[];
    var groups=[];
    var addGrops={
        status:0,
        valueOption:[],
        groups:[]
    };

    var ourteacher=[];

    function AddTeacherToList(jquery_element,selected_obj,event){

        function createOption(){
            debugger;
            jquery_element.empty();
            for(var i = 0;i<ourteacher.length;++i){
                var opt = document.createElement('option');
                opt.value = ourteacher[i].id;
                opt.innerHTML = ourteacher[i].surname+' '+ourteacher[i].name;
                if(ourteacher[i].id===selected_obj.id){
                    opt.selected=true;
                }
                opt = $(opt);
                opt.appendTo(jquery_element);
            }
            jquery_element.on('change',function(){
                event.teacher=jquery_element.val();
            });
        }

        createOption();
        this.getSelectedOption =function(){
            return jquery_element.val();
        }


    }

    //всі групи
    (function(){
        $.ajax({
            url: url+'app/calendar/getOurGroups/',
            //url: url+'app/calendar/getGroups/',
            contentType: 'application/json',
            dataType: 'json',
            success: function(doc) {
                groups=doc;
            },
            error: function(){

            }
        });
    })();

    //добавлення всіх вчителів
    (function(){
        $.ajax({
            url: url+'app/calendar/getOurTeacher',
            //url: url+'app/calendar/getGroups/',
            contentType: 'application/json',
            dataType: 'json',
            success: function(doc) {
                ourteacher=doc;
            },
            error: function(ex){
            }
        });
    })();

    function reset_addGroups(){
        addGrops.valueOption=[];
        addGrops.status=0;
        addGrops.groups=[];
    }


    function delPopup(){
        if(self.jqueryObject.popup.popup.css('display')==='block'||self.jqueryObject.popupEdit.popupEdit.css('display')==='block'){
            self.jqueryObject.popup.popup.hide();
            self.jqueryObject.popupEdit.popupEdit.hide();
            if(lasSelecrDay) {
                lasSelecrDay.css({
                    'backgroundColor': 'RGBA(0,0,0,0)'
                });
            }
            if(lastEvent) {
                lastEvent.css({
                    'backgroundColor': lastEventColor
                });
            }

            self.jqueryObject.popup.listGroups.empty();
            //маг метод з файла tcal.js , що б зкинути налаштування маленького календарика
            f_tcalCancel();
            return 1;
        }
        return 0;
    }

    function posPopup(allDay){
        var x= allDay.pageX;
        var y = allDay.pageY+10;
        var height=screen.height;
        var width=screen.width;
        var widthPopup=self.jqueryObject.popup.popup.css('width').slice(0,self.jqueryObject.popup.popup.css('width').length-2);
        var heightPopup=self.jqueryObject.popup.popup.css('height').slice(0,self.jqueryObject.popup.popup.css('height').length-2);

        x=x-(+widthPopup)/2;
        if((y+(+heightPopup)+90)>=height){
            y=y-heightPopup;
        }
        self.jqueryObject.popup.popup.css({
            'left':x,
            'top':y
        });
        self.jqueryObject.popupEdit.popupEdit.css({
            'left':x,
            'top':y
        })
    }

    function CreateSelect(parent){
        var k=0;
        var nNonSelect=1;
        var lenthGroop=0;
        function privateCreate(selectedOption) {
            function addOption(objectSelect,del,select_obj){
                console.log(select_obj);
                objectSelect.empty();
                var i = 1;
                if (addGrops.groups.length === 0 ) {
                    var opt = document.createElement('option');
                    opt.value = 0;
                    opt.innerHTML = "Пригласить групу";
                    objectSelect.append($(opt));
                    for (var j = 0; j < groups.length; ++j) {
                        opt = document.createElement('option');
                        opt.value = groups[j].id;
                        opt.innerHTML = groups[j].name;
                        objectSelect.append($(opt));
                        i++;
                    }
                }
                else{
                    if(!select_obj) {
                        var opt = document.createElement('option');
                        opt.innerHTML = "Пригласить групу";

                        if (+$select.val() === 0 && lenthGroop == 1) {
                            opt.innerHTML = "Пригласить групу";
                        }

                        opt.value = 0;
                        objectSelect.append($(opt));
                    }
                    for (var j = 0; j < groups.length; ++j) {
                        for(var m=0;m<addGrops.groups.length;++m){
                            if(+addGrops.groups[m].id===+groups[j].id){
                                break;
                            }
                            if(m===addGrops.groups.length-1){
                                opt = document.createElement('option');
                                opt.value = groups[j].id;
                                opt.innerHTML = groups[j].name;
                                objectSelect.append($(opt));
                            }
                        }
                        i++;
                    }
                }

                if(select_obj){
                    var opt = document.createElement('option');
                    opt.value = +select_obj.id;
                    opt.innerHTML = select_obj.name;

                    objectSelect.append($(opt));
                    opt.selected=true;
                    del.show();
                }else{
                    del.hide()
                }



            }
            if (addGrops.status == 0) {
                var typeVal=0;
                if(selectedOption){
                    typeVal=+selectedOption.id;
                }
                lenthGroop++;
                var $div = $('<div class="group-add">');
                $div.appendTo($(parent));

                var $select = document.createElement('select');
                $select.id = 'selectGroups' + k;
                k++;
                $select = $($select);
                $select.appendTo($div);
                var $del=$('<span class="del-groups-event"> X </span>');
                addOption($select,$del);


                $del.appendTo($div);
                $del.on('click',function(){
                    if($select.val()!='0') {
                        lenthGroop--;
                        var id = $select.attr('id');
                        var valOption = addGrops.valueOption;
                        var group = addGrops.groups;
                        for (var i = 0; i < valOption.length; ++i) {
                            if (valOption[i] === id) {
                                addGrops.valueOption.splice(i, 1);
                            }
                        }
                        for (var i = 0; i < group.length; ++i) {
                            if (group[i].valueSelect === id) {
                                addGrops.groups.splice(i, 1);
                            }
                        }
                        if(lenthGroop===0||nNonSelect===0){
                            privateCreate();
                            nNonSelect++;
                        }
                        $select.remove();
                        $(this).remove();

                    }
                });

                $select.on('change', function () {
                    if($select.val()===0){
                        $del.hide();
                    }else{
                        $del.show();
                    }
                    var text =$select.attr('id');
                    text='#'+text+' option:selected';
                    var bool=false;
                    for(var i =0;i<addGrops.valueOption.length;++i){
                        if(addGrops.valueOption[i]===$select.attr('id')){
                            bool=true;
                            break;
                        }
                    }
                    if(bool){
                        for(var i =0;i<addGrops.groups.length;++i){
                            if(addGrops.groups[i].valueSelect===$select.attr('id')){
                                addGrops.groups[i]={
                                    valueSelect: $select.attr('id'),
                                    id: $select.val(),
                                    name: $(text).text()
                                };
                                break;
                            }
                        }
                    }
                    if(!bool) {
                        addGrops.valueOption.push($select.attr('id'));
                        addGrops.groups.push({
                            valueSelect: $select.attr('id'),
                            id: $select.val(),
                            name: $(text).text()
                        });
                    }
                    if(+$select.val()!=0&&typeVal===0){
                        nNonSelect--;
                    }else
                        if(+$select.val()===0)
                        {
                            lenthGroop--;
                            $select.remove();

                        if(nNonSelect<=0){
                            nNonSelect++;
                            privateCreate();
                        }
                    }
                    if (lenthGroop < groups.length&&+$select.val()!=0&&typeVal===0) {
                        if(+$select.val()!==0) {
                            nNonSelect++;
                            privateCreate();
                        }


                    }
                    typeVal=$select.val();

                });
                $select.on('mouseover',function(){
                    var text =$select.attr('id');
                    text='#'+text+' option:selected';
                    console.log($select.val());
                    if(+$select.val()!==0) {

                        addOption($select, $del,{
                            id: $select.val(),
                            name: $(text).text()
                        });
                    }else{
                        addOption($select,$del);
                    }
                });
            }


            if(selectedOption){
                addGrops.groups.push({
                    valueSelect: 'selectGroups'+(k-1),
                    id: selectedOption.id,
                    name: selectedOption.name
                });
                addGrops.valueOption.push('selectGroups'+(k-1));
                addOption($select,$del,selectedOption);

            }
        }

        this.addSelected=function(idGroup){
            privateCreate(idGroup);
            var select  = $('#selectGroups0');
        };

        privateCreate();
    }

    this.option.eventSources=[
        {
            events: function(start, end, timezone, callback) {
                start=start._d;
                end=end._d;
                var start1 = normDate(start.getFullYear(),start.getMonth()+1,start.getDay(),start.getHours(),start.getMinutes());
                var end1 = normDate(end.getFullYear(),end.getMonth()+1,end.getDay(),end.getHours(),end.getMinutes());

                $.ajax({
                    url: url+'app/calendar/addFullEventTeacherCurrent'+'/'+start1+'/'+end1,
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(doc) {
                        self.masEvent=doc;
                        callback(doc);
                        return doc;
                    },
                    error: function(){

                    }
                });
            },
            color: masColor.myEvents.color
        },
        {
            events: function(start, end, timezone, callback) {
                start=start._d;
                end=end._d;
                var start1 = normDate(start.getFullYear(),start.getMonth()+1,start.getDay(),start.getHours(),start.getMinutes());
                var end1 = normDate(end.getFullYear(),end.getMonth()+1,end.getDay(),end.getHours(),end.getMinutes());

                $.ajax({
                    url: url+'app/calendar/addFullEventTeacherNoCurrent'+'/'+start1+'/'+end1,
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(doc) {
                        self.masEvent=doc;
                        callback(doc);
                        return doc;
                    },
                    error: function(){

                    }
                });
            },
            color: masColor.otherEvents.color
            //textColor: 'black' // an option!
        }
    ];

    this.option.dayClick=function(date, allDay, jsEvent, view) {
        self.jqueryObject.popup.button.delEvent.css({'visibility':'hidden'});
        if(delPopup()){

            return;
        }
        reset_addGroups();
        var teacherSelect = new AddTeacherToList(self.jqueryObject.popup.selectTeacher,currentUser);

        self.jqueryObject.popup.tcalInput.val(date._d.getDate()+'-'+ (date._d.getMonth()+1)+'-'+date._d.getFullYear());
        self.jqueryObject.popup.day.day.val(toFormat(date._d.getDate()));
        self.jqueryObject.popup.day.month.val(toFormat(date._d.getMonth()+1));
        self.jqueryObject.popup.day.year.val(date._d.getFullYear());
        self.jqueryObject.popup.popup.show();
        self.jqueryObject.popup.typePopup.val('');
        self.jqueryObject.popup.start.hour.val('14');
        self.jqueryObject.popup.start.minutes.val('00');
        self.jqueryObject.popup.end.hour.val('16');
        self.jqueryObject.popup.end.minutes.val('00');



        var b = new CreateSelect( self.jqueryObject.popup.listGroups);
        //self.jqueryObject.popup.typeAction.text('Создать событие');
        self.jqueryObject.popup.button.submit.text('Создать');
        action = masAction[0];
        //маг метод з файла tcal.js , що б зкинути налаштування маленького календарика
        f_tcalCancel();

        $(this).css({
            'backgroundColor':'#bce8f1'
        });
        lasSelecrDay= $(this);
        posPopup(allDay);
    };

    this.option.eventClick=function(calEvent, jsEvent, view) {
        debugger;
        reset_addGroups();
        if(delPopup()){
            return;
        }

        lastEvent=$(this);
        if(calEvent.deleted){
            $.ajax({
                url: url + 'app/calendar/restore/' + calEvent.id,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(date){
                    calEvent.deleted=false;
                    self.jqueryObject.calendar.fullCalendar( 'removeEvents' ,calEvent.id);
                    self.jqueryObject.calendar.fullCalendar( 'renderEvent' ,date[0]);
                },
                error: function(er) {
                    alert(er);
                }

            });
            return;
        }
        debugger;
        var teacher =  new AddTeacherToList(self.jqueryObject.popupEdit.selectTeacher,{
            id:calEvent.teacher
        },calEvent);
        lastEventColor = $(this).css('backgroundColor');
        $(this).css({  'backgroundColor':'#07375E' });

        var hourStart = calEvent.start._d.getHours();
        hourStart=toFormat(hourStart);
        var minutesStart = calEvent.start._d.getMinutes();
        minutesStart=toFormat(minutesStart);


        var hourEnd =calEvent.end._d.getHours();
        hourEnd=toFormat(hourEnd);


        var minutesEnd = calEvent.end._d.getMinutes();
        minutesEnd=toFormat(minutesEnd);

        self.jqueryObject.popupEdit.listGroup.empty();
        self.jqueryObject.popupEdit.tcalInput.val(calEvent.start._d.getDate()+'-'+ (calEvent.start._d.getMonth()+1)+'-'+calEvent.start._d.getFullYear());
        self.jqueryObject.popupEdit.day.day.val(toFormat(calEvent.start._d.getDate()));
        self.jqueryObject.popupEdit.day.month.val(toFormat(calEvent.start._d.getMonth()+1));
        self.jqueryObject.popupEdit.day.year.val(calEvent.start._d.getFullYear());
        self.jqueryObject.popupEdit.popupEdit.show();
        self.jqueryObject.popupEdit.titleEvent.val(calEvent.title);
        self.jqueryObject.popupEdit.start.hour.val(hourStart);
        self.jqueryObject.popupEdit.start.minutes.val(minutesStart);
        self.jqueryObject.popupEdit.end.hour.val(hourEnd);
        self.jqueryObject.popupEdit.end.minutes.val(minutesEnd);

        originalEvent=calEvent;

        idUpdate=calEvent.id;

        orig2=calEvent;
        action = masAction[1];
        posPopup(jsEvent);
        var create =new CreateSelect( self.jqueryObject.popupEdit.listGroup);
        if(calEvent.group) {
            for (var i = 0; i < calEvent.group.length; ++i) {
                create.addSelected({
                    id: calEvent.group[i].id,
                    name: calEvent.group[i].name
                });
            }
        }

    };

    //моя функція
    function addGroups(lesson_id){
        var myAddGroups=[];
        for(var i =0;i<addGrops.groups.length;++i){
            if(+addGrops.groups.id!==0){
                myAddGroups.push(addGrops.groups[i].id);
            }
        }
        //if(myAddGroups.length===0){
        //    for(var i =0;i<groups.length;++i){
        //        myAddGroups.push(groups[i].id);
        //    }
        //}
        var myget='';
        for(var i=0;i<myAddGroups.length;++i){
            myget=myget+'/'+myAddGroups[i];
        }
        var urls = url + 'app/calendar/addGroupsToLesson/'+lesson_id+myget;

        $.ajax({
            url: urls,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function(response){
                if(response.success=='success'){
                    //alert('ASDASD');
                }
            },
            error: function(er) {
                alert(er);
            }
        });
    }

    self.getCurrentUser=function(){
        var urls = url + 'app/calendar/getUserInfo';
        $.ajax({
            url: urls,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',
            success: function(response){
                currentUser=response;
                self.getGroups();
            },
            error: function(er) {

                alert(er);
            }

        });
    };

    self.getGroups = function(){
        $.ajax({
            url: url+'app/calendar/getOurGroups/',
            //url: url+'app/calendar/getGroups/',
            contentType: 'application/json',
            dataType: 'json',
            success: function(doc) {
                groups=doc;
            },
            error: function(){

            }
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
        focusDelete(this.jqueryObject.popup.typePopup);
        focusDelete(this.jqueryObject.popup.day.day);
        focusDelete(this.jqueryObject.popup.day.month);
        focusDelete(this.jqueryObject.popup.day.year);
        focusDelete(this.jqueryObject.popup.start.hour);
        focusDelete(this.jqueryObject.popup.start.minutes);
        focusDelete(this.jqueryObject.popup.end.hour);
        focusDelete(this.jqueryObject.popup.end.minutes);

        focusDelete(this.jqueryObject.popupEdit.titleEvent);
        focusDelete(this.jqueryObject.popupEdit.day.day);
        focusDelete(this.jqueryObject.popupEdit.day.month);
        focusDelete(this.jqueryObject.popupEdit.day.year);
        focusDelete(this.jqueryObject.popupEdit.start.hour);
        focusDelete(this.jqueryObject.popupEdit.start.minutes);
        focusDelete(this.jqueryObject.popupEdit.end.hour);
        focusDelete(this.jqueryObject.popupEdit.end.minutes);

    };

    //функція яка відповідає за поведення popup
    this.click_body = function(){

        $(document).on('click',function(event){
            var target=event.target;
            var bool=false;
            while(target.tagName!=='BODY') {
                if (target.className === "fc-day-grid-container"||target.className === "fc-widget-content"||target.className === "popup"||target.id==='group_block'||target.id==='tcal'||target.className === "popupEdit") {
                    bool = true;
                    break;
                } else {
                    target = target.parentElement;
                }
            }
            if(!bool){
                delPopup();
            }
        });

    };

    //синхронизація маленького календарика і поля для ввода дати
    this.syncTcalInput=function(){

        function private(date) {

            function sync() {
                self.jqueryObject.popup.tcalInput.val(date.day.val() + '-' + date.month.val() + '-' + date.year.val());
                self.jqueryObject.popupEdit.tcalInput.val(date.day.val() + '-' + date.month.val() + '-' + date.year.val());
            }

            date.day.mask('99', {placeholder: "-----"});
            date.day.on('input', function () {
                if (this.value > 31) {
                    this.value = 31;
                }
                if (this.value.length == 2) {
                    if (parseInt(this.value)) {
                        this.value = parseInt(this.value);
                        date.month.focus();
                    }

                }
                sync();
            });

            date.month.mask('99', {placeholder: "-----"});
            date.month.on('input', function () {
                if (this.value > 12) {
                    this.value = 12;
                }
                if (this.value.length == 2) {
                    if (parseInt(this.value)) {
                        this.value = parseInt(this.value);
                        date.year.focus();
                    }
                }
                sync();
            });

            date.year.mask('9999', {placeholder: "---------"});
            date.year.on('input', function () {
                if (this.value.length == 4) {
                    if (parseInt(this.value)) {
                        this.value = parseInt(this.value);
                        self.jqueryObject.popup.start.hour.focus();
                    }
                }
                sync();
            });

            $tcalInput.on('input', function () {
                var val = this.value;
                var mas = val.split('-');
                date.day.val(mas[0]);
                date.month.val(mas[1]);
                date.year.val(mas[2]);
            });
            $tcalInputEdit.on('input', function () {
                var val = this.value;
                var mas = val.split('-');
                date.day.val(mas[0]);
                date.month.val(mas[1]);
                date.year.val(mas[2]);
            });

        }
        var date = self.jqueryObject.popupEdit.day;

        private(date);
        date=self.jqueryObject.popup.day;
        private(date);




    };

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
            }
            else{
                mask.on('input',function(){
                    if(this.value>59){
                        this.value=59;
                    }
                    if(type!='minutesEnd') {
                        if (this.value.length === 2) {
                            this.value = parseInt(this.value);
                            if (parseInt(this.value)) {
                                this.value = parseInt(this.value);

                                if(mask!=$minutesEnd) {
                                    focus.focus();
                                }

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
        maskEndFocus($minutesEnd,$minutesEnd,'minutesEnd');


        $hourBegin = self.jqueryObject.popupEdit.start.hour;
        $minutesBegin = self.jqueryObject.popupEdit.start.minutes;
        $hourEnd = self.jqueryObject.popupEdit.end.hour;
        $minutesEnd = self.jqueryObject.popupEdit.end.minutes;
        maskEndFocus($hourBegin,$minutesBegin,'hour');
        maskEndFocus($minutesBegin,$hourEnd,'minutes');
        maskEndFocus($hourEnd,$minutesEnd,'hour');
        maskEndFocus($minutesEnd,$minutesEnd,'minutesEnd');


    };

    //моя функція
    function editGroups(lesson_id,originalGroup){


        var myAddGroups=[];
        var myDelGroups=[];

        if(!originalGroup) {
            originalGroup=[];
        }

        if(originalGroup.length!==0&&addGrops.length!==0){
            for(var i=0;i<addGrops.groups.length;++i){
                for(var j=0;j<originalGroup.length;++j){
                    if(addGrops.groups[i].id===originalGroup[j].id){
                        break;
                    }
                    if(j===originalGroup.length-1){
                        if(addGrops.groups[i].id!=='0') {
                            myAddGroups.push(addGrops.groups[i].id);
                        }
                    }
                }
            }
            for(var i=0;i<originalGroup.length;++i){
                for(var j=0;j<addGrops.groups.length;++j){
                    if(addGrops.groups[j].id===originalGroup[i].id){
                        break;
                    }
                    if(j===addGrops.groups.length-1){
                        myDelGroups.push(originalGroup[i].id);
                    }
                }
            }
        }

        if(originalGroup.length===0){
            for(var i=0;i<addGrops.groups.length;++i){
                if(addGrops.groups[i].id!=='0') {
                    myAddGroups.push(addGrops.groups[i].id);
                }
            }
        }
        if(addGrops.groups.length===0){
            for(var i=0;i<originalGroup.length;++i){
                myDelGroups.push(originalGroup[i].id);
            }
        }


        if(myAddGroups.length===0&&myDelGroups.length===0){
            return;
        }
        if(myAddGroups.length!==0){
            var myget='';
            for(var i=0;i<myAddGroups.length;++i){

                myget=myget+'/'+myAddGroups[i];
            }
            var urls = url + 'app/calendar/addGroupsToLesson/'+lesson_id+myget;

            $.ajax({
                url: urls,
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function(response){
                    if(response.success=='success'){
                        //alert('ASDASD');
                    }
                },
                error: function(er) {
                    alert(er);
                }
            });

        }
        if(myDelGroups.length!==0){
            var myget='';
            for(var i=0;i<myDelGroups.length;++i){
                myget=myget+'/'+myDelGroups[i];
            }
            var urls = url + 'app/calendar/deleteGroupFromLesson/'+lesson_id+myget;

            $.ajax({
                url: urls,
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json',
                success: function(response){
                    if(response.success=='success'){
                        //alert('ASDASD');
                    }
                },
                error: function(er) {
                    alert(er);
                }
            });
        }

    }

    this.editLesson= function(){
        var newDate = new Date();
        var jqueryObjectPopup  = self.jqueryObject.popupEdit;
        jqueryObjectPopup.button.submit.on('click',function(){
            var idUpdate = originalEvent.id;
            //константи
            var title= (jqueryObjectPopup.titleEvent.val()||'Новый ивент');
            var year=(jqueryObjectPopup.day.year.val()||newDate.getFullYear());
            var month=(jqueryObjectPopup.day.month.val()||newDate.getMonth()+1);
            var day=(jqueryObjectPopup.day.day.val()||newDate.getDate());
            var hourBegin=(jqueryObjectPopup.start.hour.val()||'14');
            var minutesBegin=(jqueryObjectPopup.start.minutes.val()||'00');
            var hourEnd=(jqueryObjectPopup.end.hour.val()||'16');
            var minutesEnd=(jqueryObjectPopup.end.minutes.val()||'00');

            if(! /\S/.test( title )){
                title="Новый ивент";
            };
            if(+hourEnd<=+hourBegin){
                hourEnd=hourBegin;
                if(+minutesEnd<=+minutesBegin){
                    minutesEnd=+minutesBegin+1;
                    if(+minutesEnd>=60){
                        minutesEnd=0;
                        hourEnd=+hourEnd+1;
                        if(+hourEnd>23){
                            hourBegin=22;
                            hourEnd=23;
                        }
                    }
                }
            }

            function lentghtCom(string){
                if(string.length!=2){
                    return '0'+string;
                }else{
                    return string;
                }
            }

            hourBegin=lentghtCom(hourBegin);
            minutesBegin=lentghtCom(minutesBegin);
            hourEnd=lentghtCom(hourEnd);
            minutesEnd=lentghtCom(minutesEnd);
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
            var urls=0;

            var teacher  = self.jqueryObject.popupEdit.selectTeacher.val();
                urls=url + 'app/calendar/updateEvent/' + title + '/' + startFun() + '/' + endFun()+'/'+(+idUpdate)+'/'+teacher;

            var nameteacher = '';
            var surnameTeacher = '';
            for(var i=0;i<ourteacher.length;++i){
                if(teacher===ourteacher[i].id){
                    nameteacher=ourteacher[i].name;
                    surnameTeacher=ourteacher[i].surname;
                }
            }
            var color =masColor.myEvents.color;
            if(teacher!=currentUser.id){
                color=masColor.otherEvents.color;
            }
            $.ajax({
                url: urls,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(id){
                    originalEvent.id=idUpdate;
                    originalEvent.title=title;
                    originalEvent.start=startFun();
                    originalEvent.end=endFun();
                    originalEvent.teacher=teacher;
                    originalEvent.surname=surnameTeacher;
                    originalEvent.name=nameteacher;
                    originalEvent.color=color;

                    self.jqueryObject.calendar.fullCalendar('updateEvent', originalEvent);
                    editGroups(idUpdate,originalEvent.group);
                    originalEvent.group=null;



                },
                error: function(er) {
                    alert(er);
                }

            });

            delPopup();
            return false;
        });
    };
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

            if(! /\S/.test( title )){
                title="Новый ивент";
            }
            if(+hourEnd<=+hourBegin){
                hourEnd=hourBegin;
                if(+minutesEnd<=+minutesBegin){
                    minutesEnd=+minutesBegin+1;
                    if(+minutesEnd>=60){
                        minutesEnd=0;
                        hourEnd=+hourEnd+1;
                        if(+hourEnd>23){
                            hourBegin=22;
                            hourEnd=23;
                        }
                    }
                }
            }

            function lentghtCom(string){
                if(string.length!=2){
                    return '0'+string;
                }else{
                    return string;
                }
            }

            hourBegin=lentghtCom(hourBegin);
            minutesBegin=lentghtCom(minutesBegin);
            hourEnd=lentghtCom(hourEnd);
            minutesEnd=lentghtCom(minutesEnd);
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
            var urls=0;
            var teacher = jqueryObjectPopup.selectTeacher.val();
            urls = url + 'app/calendar/addEvent/' + title + '/' + startFun() + '/' + endFun()+'/'+teacher;

            var name='';
            var surname='';
            for(var i=0;i<ourteacher.length;++i){
                if(ourteacher[i].id===teacher){
                    name=ourteacher[i].name;
                    surname=ourteacher[i].surname;
                    break;
                }
            }


            var color =masColor.myEvents.color;
            if(teacher!=currentUser.id){
                color=masColor.otherEvents.color;
            }
            $.ajax({
                url: urls,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(id){
                        self.masEvent.push({id: id.id,
                            title: title,
                            start: startFun(),
                            end: endFun(),
                            allDay: false,
                            teacher:teacher});
                        self.jqueryObject.calendar.fullCalendar('renderEvent', {
                            id: id.id,
                            title: title,
                            start: startFun(),
                            end: endFun(),
                            allDay: false,
                            teacher: teacher,
                            name: name,
                            surname: surname,
                            color:color
                        });
                        addGroups(id.id);


                },
                error: function(er) {
                    alert(er);
                }

            });

           delPopup();
            return false;
        });
    };

    this.delLesson=function(){

        this.jqueryObject.popupEdit.button.deleted.on('click',function(){
            var urls = url + 'app/calendar/delEvent/' + (+originalEvent.id);
            $.ajax({
                url: urls,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                success: function(id){
                    //self.jqueryObject.calendar.fullCalendar( 'removeEvents' ,originalEvent.id);
                    originalEvent.title='Восстановить';
                    originalEvent.backgroundColor='RGBA(0,0,0,0)';
                    originalEvent.textColor='#000';
                    originalEvent.borderColor='RGBA(0,0,0,0)';
                    originalEvent.deleted=true;
                    for(var i =0;i<self.masEvent.length;++i){
                        if(+self.masEvent[i].id===+originalEvent.id){
                            self.masEvent[i].deleted=true;
                            break;
                        }
                    }
                    self.jqueryObject.calendar.fullCalendar( 'updateEvent' ,originalEvent);
                },
                error: function(er) {

                    alert(er);
                }

            });
            delPopup();
        });

    };

    this.keyDown=function(){
        $(document).on('keydown',function(e){

            if(e.keyCode===27){
                delPopup();
            }
        });
    };

    this.resetPopup=function(){
        self.jqueryObject.popup.button.reset.on('click',function(){
            delPopup();
            return 0;
        });

    }

}

$(document).ready(function() {
    var calendar = new Calendar_teacher();
    calendar.getCurrentUser();
    calendar.focusDeleted();
    calendar.editLesson();
    calendar.click_body();
    calendar.syncTcalInput();
    calendar.timeIvent();
    calendar.addLesson();
    calendar.delLesson();
    calendar.realTimeUpdate();
    calendar.keyDown();
    calendar.getCurrentUser();
    calendar.getGroups();
    calendar.resetPopup();
$(".deleteGroup").on("click",function(){
    alert($(this).attr("id_g"));
});
    calendar.option.getCurrentUser();



});