<?php
/**
 * Created by PhpStorm.
 * User: Таня
 * Date: 22.01.2015
 * Time: 17:55
 * */

class Calendars extends Controller {

    private $userInfo;

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
    public function index() {
        $this->model = $this->loadModel('lesson');
//        $data =$this->userInfo;

        $data['title'] = "Calendar|Rozklad";
        $data['groups'] = $this->model->getList();
        $data['name'] = $this->userInfo['name'] . ' ' . $this->userInfo['surname'];
        $data['status'] = $this->userInfo['title'];
        $data['photo']='http://graph.facebook.com/'. $this->userInfo['fb_id'] . '/picture?type=large';
        /*$this->view->renderAllHTML('groups/index',
            $data,
            array('groups/groups.css'));*/
        $this->view->renderHtml('common/head',$data);
        $this->view->renderHtml('common/header', $data);
        if($this->userInfo['title']==='teacher') {
            $this->view->renderHtml('calendars/popup', $data);
        }
        $this->view->renderHtml('calendars/index', $data);
//        $this->view->renderHtml('common/footer');
        $this->view->renderHtml('common/foot');

    }

    public function getOurInfForTeacher(){
        if($this->userInfo['title']==='teacher') {
            $this->model = $this->loadModel('groups');
            $returns['group'] = $this->model->getOurGroups();
            $returns['user'] = $this->userInfo;
            $this->model = $this->loadModel('user');
            $returns['teacher'] = $this->model->getOurTeacher();
            $returns['status'] = 'ok';
            $this->view->renderJson($returns);
        }else{
            $returns['status'] = 'noteacher';
            $this->view->renderJson($returns);
        }
    }

    public function getOurEventTeacher(){
        if($this->userInfo['title']==='teacher') {
            if(isset($_POST['start'])&&isset($_POST['end'])) {
                $this->model = $this->loadModel('lessons');
                $returns['data'] = $this->model->getOurEventTeacher($_POST['start'],$_POST['end']);
                $returns['status'] = 'ok';
                $this->view->renderJson($returns);
            }
            else{
                $returns['status'] = 'notPost';
                $this->view->renderJson($returns);
            }
        }else{
            $returns['status'] = 'noteacher';
            $this->view->renderJson($returns);
        }
    }

    public function addEvent()
    {
        if($this->userInfo['title']==='teacher') {
            if (isset($_POST['title']) && isset($_POST['start']) && isset($_POST['end']) && isset($_POST['teacher'])) {
                $this->model = $this->loadModel('lessons');
//            print_r($_POST);
                $title = $_POST['title'];
                $start = $_POST['start'];
                $end = $_POST['end'];
                $teacher = $_POST['teacher'];
                $id = $this->model->addLesson($title, $start, $end, $teacher);
                if ($id == null) {
                    echo 'Ошибка';
                } else {
                    if (isset($_POST['group'])) {
                        $this->addGroupsToLesson($id, $_POST['group']);
                    }
                    $this->view->renderJson(array('id' => $id));
                }
            }
        }else{
            $this->view->renderJson(array('status' => 'noteacher'));
        }
    }


}