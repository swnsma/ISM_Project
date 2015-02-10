<?php
/**
 * Created by PhpStorm.
 * User: Таня
 * Date: 22.01.2015
 * Time: 17:55
 * */

class Calendar extends Controller {

    private $userInfo;
    private $role='teacher';

    public function __construct() {
        parent::__construct();
        $id = $_SESSION['id'];
        if($id===null){
            $this->logout();
        }
        $this->model = $this->loadModel('user');
        $this->userInfo=$this->model->getCurrentUserInfo($id);
        if($this->userInfo===null){
            $this->logout();
        }
    }
    public function getUserInfo(){
        $this->view->renderJson($this->userInfo);
    }
    public function index() {
        $this->model = $this->loadModel('lesson');
        $data =$this->userInfo;
        $this->view->renderHtml('calendar/index', $data);
    }
    public function addFullEventDefault(){
        if(isset($_POST['start'])&&$_POST['end']) {
            $this->model = $this->loadModel('lesson');
            $start = $_POST['start'];
            $end = $_POST['end'];
            $id = $this->model->getOurLessonForThisIdStudent($this->userInfo, $start, $end);
            $this->view->renderJson($id);
        }
    }
    public function getOurGroups(){
        $this->model = $this->loadModel('groups');
        $arr=$this->model->getOurGroups($this->userInfo['id']);
        $this->view->renderJson($arr);
    }
    public function getOurTeacher(){
        $this->model = $this->loadModel('user');
        $date=$this->model->getOurTeacher();
        $this->view->renderJson($date);
    }
    public function addFullEventTeacherCurrent(){
        if(isset($_POST['start'])&&isset($_POST['end']));
        {
            $this->model = $this->loadModel('lesson');
            $start = $_POST['start'];
            $end = $_POST['end'];
            $id = $this->model->getOurLessonForThisIdTeacherCurrent($this->userInfo, $start, $end);
            $this->view->renderJson($id);
        }
    }
    public function addFullEventTeacherNoCurrent(){
        if(isset($_POST['start'])&&isset($_POST['end']));
        {
            $this->model = $this->loadModel('lesson');
            $start = $_POST['start'];
            $end = $_POST['end'];
            $id = $this->model->getOurLessonForThisIdTeacherNoCurrent($this->userInfo, $start, $end);
            $this->view->renderJson($id);
        }
    }
    public function restore(){
        if(isset($_POST['id'])) {
            $this->model = $this->loadModel('lesson');
            $id = $_POST['id'];
            $date = $this->model->restore($id);
            $this->view->renderJson($date);
        }
    }
    public function addGroupsToLesson(){
        print_r($_POST);
        if(isset($_POST['lesson_id'])&&isset($_POST['group_id'])) {
            $lessonId = $_POST['lesson_id'];
            $var = $_POST['group_id'];

            $this->model = $this->loadModel('grouplesson');
            for ($i = 0; $i < count($var); ++$i) {
                $this->model->addGroupToLesson($lessonId, $var[$i]);
            }
            $this->view->renderJson(Array('success' => 'success'));
        }
    }
    public function deleteGroupFromLesson(){
        print_r($_POST);
        if(isset($_POST['lesson_id'])&&isset($_POST['group_id'])) {
            $lessonId = $_POST['lesson_id'];
            $var = $_POST['group_id'];
            $this->model = $this->loadModel("lesson");
            for ($i = 0; $i < count($var); ++$i) {
                $success = $this->model->deleteGroupFromLesson($lessonId, $var[$i]);
            }
            $this->view->renderJson(Array('success' => $success));
        }
    }
    public function updateEvent(){
        if(isset($_POST['title']) && isset($_POST['start'])&&isset($_POST['end'])&&isset($_POST['id'])&&isset($_POST['teacher'])) {
            $this->model = $this->loadModel('lesson');
            $title = $_POST['title'];
            $start = $_POST['start'];
            $end = $_POST['end'];
            $id = $_POST['id'];
            $teacherId = $_POST['teacher'];
            $this->model->updateLesson($title, $start, $end, $id, $teacherId);
            $this->view->renderJson("succeess");
        }
    }
    public function addEvent(){
        if(isset($_POST['title'])&&isset($_POST['start'])&&isset($_POST['end'])&&isset($_POST['teacher'])) {
            $this->model = $this->loadModel('lesson');
            $title = $_POST['title'];
            $start = $_POST['start'];
            $end = $_POST['end'];
            $teacher = $_POST['teacher'];
            $id = $this->model->addLesson($title, $start, $end, $teacher);

            if ($id == null) {
                echo 'Ошибка';
            } else {
                $this->view->renderJson(array('id' => $id));
            }
        }
    }
    public function delEvent(){

        if(isset($_POST['id'])) {
            $this->model = $this->loadModel('lesson');
            $id = $_POST['id'];
            $this->model->delEvent($id);

            $this->view->renderJson("success");
        }
    }











































    public function getGroups(){
        $this->model = $this->loadModel('groups');
//        print $this->userInfo['id'];
        $arr=$this->model->getGroups($this->userInfo['id']);


        $this->view->renderJson($arr);
    }

    //+
    public function getAllGroupsForThisLesson(){
        $request=Request::getInstance();
        $this->model = $this->loadModel('lesson');
        $arr=$this->model->getAllGroupsForThisLesson($request->getParam(0));
        $this->view->renderJson($arr);
    }


    //використовую
    public function getRealTimeUpdate(){
        $this->model = $this->loadModel('lesson');
        $interval=Request::getInstance()->getParam(0);

        $id=$this->model->getRealTimeUpdate($interval,$this->userInfo);

        $this->view->renderJson($id);
    }

    //використовую


    //використовую




}